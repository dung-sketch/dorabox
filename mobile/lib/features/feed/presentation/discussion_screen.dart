import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../domain/models/post_model.dart';
import 'widgets/block_dialog.dart';
import 'widgets/reaction_bottom_sheet.dart';
import 'widgets/report_bottom_sheet.dart';

class CommentModel {
  final String id;
  final String authorName;
  final String authorAvatar;
  final String createdAtText;
  final String content;
  final int reactionsCount;
  final String userReaction;
  final String? replyToUser;

  const CommentModel({
    required this.id,
    required this.authorName,
    required this.authorAvatar,
    required this.createdAtText,
    required this.content,
    this.reactionsCount = 0,
    this.userReaction = '',
    this.replyToUser,
  });

  CommentModel copyWith({
    String? userReaction,
    int? reactionsCount,
    String? replyToUser,
  }) {
    return CommentModel(
      id: id,
      authorName: authorName,
      authorAvatar: authorAvatar,
      createdAtText: createdAtText,
      content: content,
      reactionsCount: reactionsCount ?? this.reactionsCount,
      userReaction: userReaction ?? this.userReaction,
      replyToUser: replyToUser ?? this.replyToUser,
    );
  }
}

class DiscussionScreen extends StatefulWidget {
  final PostModel post;

  const DiscussionScreen({
    super.key,
    required this.post,
  });

  @override
  State<DiscussionScreen> createState() => _DiscussionScreenState();
}

class _DiscussionScreenState extends State<DiscussionScreen> {
  late PostModel _currentPost;
  final TextEditingController _commentController = TextEditingController();
  final FocusNode _focusNode = FocusNode();

  String? _replyingToUser;

  final List<CommentModel> _comments = [
    const CommentModel(
      id: 'c1',
      authorName: 'Nguyễn Mạnh Dũng',
      authorAvatar: '',
      createdAtText: '15/10/2026 · 16:01',
      content: 'Vip quá shop ơi 🙈',
      reactionsCount: 1,
      userReaction: '',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _currentPost = widget.post;
  }

  @override
  void dispose() {
    _commentController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _sendComment() {
    final text = _commentController.text.trim();
    if (text.isEmpty) return;

    HapticFeedback.mediumImpact();
    setState(() {
      _comments.add(
        CommentModel(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          authorName: 'Bạn',
          authorAvatar: '',
          createdAtText: 'Vừa xong',
          content: text,
          replyToUser: _replyingToUser,
          reactionsCount: 0,
        ),
      );
      _currentPost = _currentPost.copyWith(
        commentsCount: _currentPost.commentsCount + 1,
      );
      _commentController.clear();
      _replyingToUser = null;
    });
    FocusScope.of(context).unfocus();
  }

  void _deleteComment(int index) {
    HapticFeedback.lightImpact();
    setState(() {
      _comments.removeAt(index);
      _currentPost = _currentPost.copyWith(
        commentsCount: (_currentPost.commentsCount > 0) ? _currentPost.commentsCount - 1 : 0,
      );
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Đã xóa bình luận'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _handleReactionBottomSheet() async {
    final selected = await ReactionBottomSheet.show(
      context,
      currentReaction: _currentPost.userReaction,
    );

    if (selected != null) {
      setState(() {
        final wasLiked = _currentPost.userReaction.isNotEmpty;
        _currentPost = _currentPost.copyWith(
          userReaction: selected.key,
          likesCount: wasLiked ? _currentPost.likesCount : _currentPost.likesCount + 1,
          reactionsCount: wasLiked ? _currentPost.reactionsCount : _currentPost.reactionsCount + 1,
        );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary, size: 24),
          onPressed: () => Navigator.of(context).pop(_currentPost),
        ),
        title: const Text(
          'Thảo luận',
          style: TextStyle(
            color: AppColors.textPrimary,
            fontSize: 20,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: Column(
        children: [
          // Nội dung cuộn: Bài viết gốc + Danh sách bình luận
          Expanded(
            child: ListView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.only(bottom: 24),
              children: [
                _buildPostHeader(),
                const SizedBox(height: 16),
                _buildCommentHeader(),
                const SizedBox(height: 8),
                ...List.generate(_comments.length, (index) {
                  return _buildCommentItem(_comments[index], index);
                }),
              ],
            ),
          ),

          // Thanh input viết bình luận ở đáy (có chế độ "Trả lời")
          _buildBottomInputBar(),
        ],
      ),
    );
  }

  Widget _buildPostHeader() {
    final isLiked = _currentPost.userReaction.isNotEmpty;

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 14),
      decoration: BoxDecoration(
        color: AppColors.surface.withValues(alpha: 0.5),
        border: Border(
          bottom: BorderSide(
            color: Colors.white.withValues(alpha: 0.05),
            width: 1,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author & Verified
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white,
                  border: Border.all(color: AppColors.collarRed, width: 2),
                ),
                child: Center(
                  child: Container(
                    width: 28,
                    height: 28,
                    decoration: const BoxDecoration(
                      color: AppColors.collarRed,
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Icon(Icons.play_arrow_rounded, color: Colors.white, size: 20),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          _currentPost.authorName,
                          style: const TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        if (_currentPost.isVerified) ...[
                          const SizedBox(width: 6),
                          const Icon(Icons.verified_rounded, color: AppColors.doraemonBlue, size: 18),
                        ],
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      _currentPost.createdAtText,
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                    ),
                  ],
                ),
              ),
              PopupMenuButton<String>(
                color: AppColors.surfaceSecondary,
                icon: const Icon(Icons.more_horiz_rounded, color: AppColors.textSecondary),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                  side: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
                ),
                elevation: 8,
                onSelected: (value) async {
                  HapticFeedback.lightImpact();
                  if (value == 'report') {
                    final reason = await ReportBottomSheet.show(context);
                    if (!mounted) return;
                    if (reason != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Đã gửi báo cáo: "$reason". Cảm ơn bạn!'),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    }
                  } else if (value == 'block') {
                    final confirmed = await BlockAuthorDialog.show(
                      context,
                      authorName: _currentPost.authorName,
                    );
                    if (!mounted) return;
                    if (confirmed == true) {
                      Navigator.of(context).pop();
                    }
                  }
                },
                itemBuilder: (ctx) => [
                  const PopupMenuItem(
                    value: 'report',
                    child: Text(
                      'Báo cáo bài viết',
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'block',
                    child: Text(
                      'Chặn người dùng',
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Nội dung bài
          Text(
            _currentPost.content,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 15,
              height: 1.45,
            ),
          ),

          if (_currentPost.giftCode != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.surfaceLight.withValues(alpha: 0.8),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.bellGold.withValues(alpha: 0.25)),
              ),
              child: Row(
                children: [
                  const Text('🎟️', style: TextStyle(fontSize: 16)),
                  const SizedBox(width: 8),
                  Text(
                    'Giftcode: ${_currentPost.giftCode}',
                    style: const TextStyle(
                      color: AppColors.bellGold,
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 12),
          const Text(
            'Lưu ý: Mã cần được kích hoạt trên hệ thống để sử dụng.',
            style: TextStyle(color: AppColors.textMuted, fontSize: 13.5),
          ),

          const SizedBox(height: 14),

          // Thanh cảm xúc & bình luận
          Row(
            children: [
              InkWell(
                borderRadius: BorderRadius.circular(20),
                onTap: _handleReactionBottomSheet,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                  child: Row(
                    children: [
                      Icon(
                        isLiked ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                        color: isLiked ? AppColors.collarRed : AppColors.textSecondary,
                        size: 18,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        isLiked ? 'Yêu thích' : 'Cảm xúc',
                        style: TextStyle(
                          color: isLiked ? AppColors.collarRed : AppColors.textSecondary,
                          fontSize: 13,
                          fontWeight: isLiked ? FontWeight.w600 : FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Row(
                children: [
                  const Icon(Icons.sentiment_satisfied_alt_rounded, color: AppColors.textSecondary, size: 18),
                  const SizedBox(width: 5),
                  Text(
                    '${_currentPost.reactionsCount}',
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                  ),
                ],
              ),
              const SizedBox(width: 16),
              Row(
                children: [
                  const Icon(Icons.chat_bubble_outline_rounded, color: AppColors.textSecondary, size: 17),
                  const SizedBox(width: 6),
                  Text(
                    '${_currentPost.commentsCount}',
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCommentHeader() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Text(
        'Bình luận · Mới nhất',
        style: TextStyle(
          color: AppColors.textPrimary,
          fontSize: 16.5,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }

  Widget _buildCommentItem(CommentModel comment, int index) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface.withValues(alpha: 0.65),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.05),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Avatar người bình luận (màu chibi tươi sáng)
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF2E384D),
                  border: Border.all(color: AppColors.doraemonBlue.withValues(alpha: 0.5), width: 1.5),
                ),
                child: const Center(
                  child: Icon(Icons.person, color: Colors.white70, size: 22),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      comment.authorName,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      comment.createdAtText,
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 11.5),
                    ),
                  ],
                ),
              ),

              // Menu 3 chấm dọc -> Popup "Xóa bình luận" (Ảnh 3)
              PopupMenuButton<String>(
                color: AppColors.surfaceSecondary,
                icon: const Icon(Icons.more_vert_rounded, color: AppColors.textSecondary, size: 20),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
                ),
                onSelected: (value) {
                  if (value == 'delete') {
                    _deleteComment(index);
                  }
                },
                itemBuilder: (ctx) => [
                  const PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(Icons.delete_outline_rounded, color: AppColors.collarRed, size: 18),
                        SizedBox(width: 8),
                        Text('Xóa bình luận', style: TextStyle(color: AppColors.textPrimary)),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Nội dung bình luận
          if (comment.replyToUser != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Text(
                '@${comment.replyToUser}',
                style: const TextStyle(
                  color: AppColors.doraemonBlue,
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                ),
              ),
            ),

          Text(
            comment.content,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 14.5,
              height: 1.4,
            ),
          ),

          const SizedBox(height: 10),

          // Action của comment: Cảm xúc, count, Trả lời
          Row(
            children: [
              InkWell(
                onTap: () {
                  HapticFeedback.lightImpact();
                  setState(() {
                    final hasReact = comment.userReaction.isNotEmpty;
                    _comments[index] = comment.copyWith(
                      userReaction: hasReact ? '' : 'like',
                      reactionsCount: hasReact ? comment.reactionsCount - 1 : comment.reactionsCount + 1,
                    );
                  });
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 4),
                  child: Row(
                    children: [
                      Icon(
                        comment.userReaction.isNotEmpty ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                        color: comment.userReaction.isNotEmpty ? AppColors.collarRed : AppColors.textSecondary,
                        size: 15,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Cảm xúc',
                        style: TextStyle(
                          color: comment.userReaction.isNotEmpty ? AppColors.collarRed : AppColors.textSecondary,
                          fontSize: 12.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Row(
                children: [
                  const Icon(Icons.sentiment_satisfied_alt_rounded, color: AppColors.textSecondary, size: 15),
                  const SizedBox(width: 4),
                  Text('${comment.reactionsCount}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                ],
              ),
              const SizedBox(width: 14),
              InkWell(
                onTap: () {
                  HapticFeedback.lightImpact();
                  setState(() {
                    _replyingToUser = comment.authorName;
                  });
                  _focusNode.requestFocus();
                },
                child: const Padding(
                  padding: EdgeInsets.symmetric(vertical: 4, horizontal: 4),
                  child: Text(
                    'Trả lời',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBottomInputBar() {
    return Container(
      padding: EdgeInsets.fromLTRB(
        16,
        8,
        16,
        MediaQuery.of(context).padding.bottom + 8,
      ),
      decoration: BoxDecoration(
        color: AppColors.surfaceSecondary,
        border: Border(
          top: BorderSide(
            color: Colors.white.withValues(alpha: 0.08),
            width: 1,
          ),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Banner đang trả lời người dùng kèm nút X (Ảnh 3)
          if (_replyingToUser != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  Text(
                    'Trả lời $_replyingToUser',
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const Spacer(),
                  InkWell(
                    onTap: () {
                      HapticFeedback.lightImpact();
                      setState(() {
                        _replyingToUser = null;
                      });
                    },
                    child: const Icon(Icons.close_rounded, color: AppColors.textPrimary, size: 18),
                  ),
                ],
              ),
            ),

          // Hàng Input: TextField + Nút gửi tròn vàng chuông
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.08),
                      width: 1,
                    ),
                  ),
                  child: TextField(
                    controller: _commentController,
                    focusNode: _focusNode,
                    style: const TextStyle(color: AppColors.textPrimary, fontSize: 14.5),
                    decoration: const InputDecoration(
                      hintText: 'Viết bình luận...',
                      hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 14.5),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),

              // Nút gửi hình tròn màu Vàng Chuông (Dora Bell Gold)
              InkWell(
                borderRadius: BorderRadius.circular(24),
                onTap: _sendComment,
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: AppColors.bellGold,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.bellGold.withValues(alpha: 0.35),
                        blurRadius: 10,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.send_rounded,
                      color: AppColors.background,
                      size: 20,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
