import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../core/theme/app_colors.dart';

class ReactionItem {
  final String key;
  final String emoji;
  final String label;

  const ReactionItem({
    required this.key,
    required this.emoji,
    required this.label,
  });
}

const List<ReactionItem> kReactions = [
  ReactionItem(key: 'like', emoji: '👍', label: 'Thích'),
  ReactionItem(key: 'love', emoji: '❤️', label: 'Yêu thích'),
  ReactionItem(key: 'haha', emoji: '😆', label: 'Haha'),
  ReactionItem(key: 'wow', emoji: '😮', label: 'Wow'),
  ReactionItem(key: 'sad', emoji: '😢', label: 'Buồn'),
  ReactionItem(key: 'care', emoji: '🤗', label: 'Quan tâm'),
];

/// Modal Bottom Sheet "Bạn cảm thấy thế nào?" theo Ảnh 1
class ReactionBottomSheet extends StatelessWidget {
  final String currentReaction;
  final Function(ReactionItem selected) onSelect;

  const ReactionBottomSheet({
    super.key,
    required this.currentReaction,
    required this.onSelect,
  });

  static Future<ReactionItem?> show(
    BuildContext context, {
    String currentReaction = '',
  }) {
    HapticFeedback.lightImpact();
    return showModalBottomSheet<ReactionItem>(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => ReactionBottomSheet(
        currentReaction: currentReaction,
        onSelect: (item) {
          Navigator.of(ctx).pop(item);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        20,
        14,
        20,
        MediaQuery.of(context).padding.bottom + 20,
      ),
      decoration: BoxDecoration(
        color: AppColors.surfaceSecondary,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(26)),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.08),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.5),
            blurRadius: 28,
            offset: const Offset(0, -6),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag Handle bar ở giữa
          Center(
            child: Container(
              width: 38,
              height: 4.5,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.25),
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Tiêu đề: "Bạn cảm thấy thế nào?"
          const Text(
            'Bạn cảm thấy thế nào?',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontSize: 19,
              fontWeight: FontWeight.w700,
              letterSpacing: -0.3,
            ),
          ),

          const SizedBox(height: 18),

          // Lưới 6 nút phản ứng (2 cột x 3 hàng)
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              mainAxisSpacing: 12,
              crossAxisSpacing: 10,
              childAspectRatio: 2.3,
            ),
            itemCount: kReactions.length,
            itemBuilder: (context, index) {
              final item = kReactions[index];
              final isSelected = currentReaction == item.key;

              return InkWell(
                borderRadius: BorderRadius.circular(14),
                onTap: () {
                  HapticFeedback.lightImpact();
                  onSelect(item);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.bellGold.withValues(alpha: 0.15)
                        : AppColors.surface.withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.bellGold
                          : Colors.white.withValues(alpha: 0.12),
                      width: 1.2,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        item.emoji,
                        style: const TextStyle(fontSize: 16),
                      ),
                      const SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          item.label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: isSelected
                                ? AppColors.bellGold
                                : AppColors.textPrimary,
                            fontSize: 13,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
