-- =========================================================================
-- DORABOX - MIGRATION 09: CHỐNG SPAM PHẢN ỨNG (ANTI-SPAM REACTIONS & ATOMIC RPC)
-- =========================================================================

-- 1. Hàm nguyên tử (Atomic Function) xử lý thả/đổi/gỡ cảm xúc một cách an toàn, chống race condition & spam
create or replace function public.toggle_post_reaction(
  p_post_id uuid,
  p_reaction_type text default 'like'
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_current_type text;
  v_result jsonb;
begin
  -- Lấy ID người dùng đang đăng nhập
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Người dùng chưa được xác thực';
  end if;

  -- Kiểm tra xem đã thả cảm xúc cho bài viết này chưa
  select reaction_type into v_current_type
  from public.post_reactions
  where post_id = p_post_id and user_id = v_user_id;

  if v_current_type is not null then
    if v_current_type = p_reaction_type or p_reaction_type = '' then
      -- Bấm lại cùng loại hoặc gửi chuỗi rỗng -> Gỡ bỏ reaction
      delete from public.post_reactions
      where post_id = p_post_id and user_id = v_user_id;

      v_result := jsonb_build_object(
        'action', 'removed',
        'previous_type', v_current_type,
        'current_type', ''
      );
    else
      -- Đổi sang cảm xúc khác -> Cập nhật trực tiếp mà không cần xóa rồi thêm lại
      update public.post_reactions
      set reaction_type = p_reaction_type,
          created_at = timezone('utc'::text, now())
      where post_id = p_post_id and user_id = v_user_id;

      v_result := jsonb_build_object(
        'action', 'updated',
        'previous_type', v_current_type,
        'current_type', p_reaction_type
      );
    end if;
  else
    -- Chưa từng thả cảm xúc -> Thêm mới an toàn (kèm ON CONFLICT DO UPDATE chống spam đồng thời)
    insert into public.post_reactions (post_id, user_id, reaction_type, created_at)
    values (p_post_id, v_user_id, p_reaction_type, timezone('utc'::text, now()))
    on conflict (post_id, user_id) 
    do update set reaction_type = excluded.reaction_type, created_at = excluded.created_at;

    v_result := jsonb_build_object(
      'action', 'inserted',
      'current_type', p_reaction_type
    );
  end if;

  return v_result;
end;
$$;

-- Cấp quyền gọi hàm cho người dùng đã đăng nhập
grant execute on function public.toggle_post_reaction(uuid, text) to authenticated;
