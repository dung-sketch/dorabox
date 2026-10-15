import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/liquid_glass.dart';
import '../../chat/presentation/chat_list_screen.dart';
import '../../create_post/presentation/create_post_screen.dart';
import '../domain/models/post_model.dart';
import 'discussion_screen.dart';
import 'widgets/block_dialog.dart';
import 'widgets/post_card.dart';
import 'widgets/reaction_bottom_sheet.dart';
import 'widgets/report_bottom_sheet.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _currentNavIndex = 3; // Mặc định ở tab "Cộng đồng"

  // Danh sách bài viết mẫu ban đầu cho Mạng Xã Hội Mini Dorabox
  final List<PostModel> _posts = [
    const PostModel(
      id: '1',
      authorName: 'Dorabox',
      authorAvatar: '',
      isVerified: true,
      createdAtText: '15/10/2026 · 15:38',
      content: 'Chào mừng bạn đến với Dorabox – Không gian mạng xã hội mini kết nối bạn bè, chia sẻ khoảnh khắc và trải nghiệm realtime siêu mượt! 🎉✨',
      giftCode: 'DORABOX-VIP2026',
      likesCount: 12,
      reactionsCount: 12,
      commentsCount: 3,
      userReaction: 'love',
    ),
    const PostModel(
      id: '2',
      authorName: 'Minh Hoàng',
      authorAvatar: '',
      isVerified: false,
      createdAtText: '12/10/2026 · 20:15',
      content: 'Giao diện Liquid Glass mượt thực sự mọi người ạ, lướt 120Hz trên Android không thấy giật khung hình nào luôn. Cực thích tone màu Doraemon này! 🔥',
      likesCount: 8,
      reactionsCount: 8,
      commentsCount: 2,
      userReaction: 'wow',
    ),
    const PostModel(
      id: '3',
      authorName: 'Dorabox',
      authorAvatar: '',
      isVerified: true,
      createdAtText: '09/10/2026 · 19:42',
      content: 'Mọi người trải nghiệm nếu có góp ý gì để Dorabox hoàn thiện hơn thì bình luận ngay bên dưới nhé! Chúng mình luôn lắng nghe cộng đồng.',
      likesCount: 5,
      reactionsCount: 5,
      commentsCount: 1,
      userReaction: 'like',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _openCreatePost() async {
    HapticFeedback.lightImpact();
    final result = await Navigator.of(context).push<String>(
      MaterialPageRoute(builder: (_) => const CreatePostScreen()),
    );

    if (result != null && result.isNotEmpty) {
      if (!mounted) return;
      setState(() {
        _posts.insert(
          0,
          PostModel(
            id: DateTime.now().millisecondsSinceEpoch.toString(),
            authorName: 'Bạn',
            authorAvatar: '',
            isVerified: false,
            createdAtText: 'Vừa xong',
            content: result,
            likesCount: 0,
            reactionsCount: 0,
            commentsCount: 0,
          ),
        );
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🎉 Bài viết của bạn đã được đăng thành công!'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _toggleReaction(int index) {
    setState(() {
      final post = _posts[index];
      final isLiked = post.userReaction.isNotEmpty;
      _posts[index] = post.copyWith(
        userReaction: isLiked ? '' : 'like',
        likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
        reactionsCount: isLiked ? post.reactionsCount - 1 : post.reactionsCount + 1,
      );
    });
  }

  void _openReactionBottomSheet(int index) async {
    final post = _posts[index];
    final selected = await ReactionBottomSheet.show(
      context,
      currentReaction: post.userReaction,
    );

    if (selected != null) {
      setState(() {
        final wasLiked = post.userReaction.isNotEmpty;
        _posts[index] = post.copyWith(
          userReaction: selected.key,
          likesCount: wasLiked ? post.likesCount : post.likesCount + 1,
          reactionsCount: wasLiked ? post.reactionsCount : post.reactionsCount + 1,
        );
      });
    }
  }

  void _openDiscussion(int index) async {
    HapticFeedback.lightImpact();
    final updatedPost = await Navigator.of(context).push<PostModel>(
      MaterialPageRoute(
        builder: (_) => DiscussionScreen(post: _posts[index]),
      ),
    );

    if (updatedPost != null) {
      setState(() {
        _posts[index] = updatedPost;
      });
    }
  }

  void _handleReport(int index) async {
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
  }

  void _handleBlock(int index) async {
    final post = _posts[index];
    final confirmed = await BlockAuthorDialog.show(
      context,
      authorName: post.authorName,
    );

    if (!mounted) return;
    if (confirmed == true) {
      setState(() {
        _posts.removeWhere((p) => p.authorName == post.authorName);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Đã chặn ${post.authorName}. Bạn có thể bỏ chặn từ bảng tin.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Nội dung Feed có thể cuộn
          NestedScrollView(
            headerSliverBuilder: (context, innerBoxIsScrolled) {
              return [
                // Top AppBar kính lỏng: "Cộng đồng" + Chat & Notifications
                SliverAppBar(
                  pinned: true,
                  floating: true,
                  elevation: 0,
                  backgroundColor: AppColors.background.withValues(alpha: 0.9),
                  title: const Text(
                    'Cộng đồng',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.5,
                    ),
                  ),
                  actions: [
                    IconButton(
                      icon: const Icon(
                        Icons.chat_bubble_outline_rounded,
                        color: AppColors.textPrimary,
                        size: 24,
                      ),
                      onPressed: () {
                        HapticFeedback.lightImpact();
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const ChatListScreen()),
                        );
                      },
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.notifications_none_rounded,
                        color: AppColors.textPrimary,
                        size: 25,
                      ),
                      onPressed: () {
                        HapticFeedback.lightImpact();
                      },
                    ),
                    const SizedBox(width: 8),
                  ],
                  bottom: PreferredSize(
                    preferredSize: const Size.fromHeight(48),
                    child: Container(
                      decoration: BoxDecoration(
                        border: Border(
                          bottom: BorderSide(
                            color: Colors.white.withValues(alpha: 0.05),
                            width: 1,
                          ),
                        ),
                      ),
                      child: TabBar(
                        controller: _tabController,
                        indicatorColor: AppColors.bellGold,
                        indicatorWeight: 3.5,
                        indicatorSize: TabBarIndicatorSize.label,
                        dividerColor: Colors.transparent,
                        labelColor: AppColors.textPrimary,
                        unselectedLabelColor: AppColors.textMuted,
                        labelStyle: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                        unselectedLabelStyle: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                        tabs: const [
                          Tab(text: 'Dành cho bạn'),
                          Tab(text: 'Mới nhất'),
                        ],
                      ),
                    ),
                  ),
                ),
              ];
            },
            body: TabBarView(
              controller: _tabController,
              children: [
                // Tab 1: Dành cho bạn
                _buildFeedList(),
                // Tab 2: Mới nhất
                _buildFeedList(),
              ],
            ),
          ),

          // Nút FAB viết bài màu vàng chuông (Dora Bell Gold) góc dưới bên phải
          Positioned(
            right: 20,
            bottom: 96,
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: _openCreatePost,
              child: Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  color: AppColors.bellGold,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.bellGold.withValues(alpha: 0.4),
                      blurRadius: 18,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(
                    Icons.edit_outlined,
                    color: AppColors.background,
                    size: 26,
                  ),
                ),
              ),
            ),
          ),

          // Bottom Navigation Bar dạng Liquid Glass Dock nổi
          Positioned(
            left: 16,
            right: 16,
            bottom: 16,
            child: LiquidGlassContainer(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              borderRadius: 26,
              blurSigma: 18,
              backgroundColor: AppColors.surfaceGlass,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildNavItem(0, Icons.home_filled, 'Trang chủ'),
                  _buildNavItem(1, Icons.bookmark_outline_rounded, 'Yêu thích'),
                  _buildNavItem(2, Icons.notifications_none_rounded, 'Thông báo'),
                  _buildNavItem(3, Icons.people_alt_rounded, 'Cộng đồng'),
                  _buildNavItem(4, Icons.person_outline_rounded, 'Tài khoản'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeedList() {
    return ListView.builder(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.only(top: 14, bottom: 120),
      itemCount: _posts.length + 1,
      itemBuilder: (context, index) {
        if (index == 0) {
          // Thanh trạng thái: "Bạn đang nghĩ về bộ phim nào?"
          return Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: InkWell(
              borderRadius: BorderRadius.circular(30),
              onTap: _openCreatePost,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: AppColors.surface.withValues(alpha: 0.6),
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.08),
                    width: 1,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withValues(alpha: 0.08),
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.edit_rounded,
                          color: AppColors.textSecondary,
                          size: 18,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Text(
                        'Bạn đang nghĩ gì thế?',
                        style: TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ),
                    const Icon(
                      Icons.add_photo_alternate_outlined,
                      color: AppColors.textMuted,
                      size: 22,
                    ),
                    const SizedBox(width: 4),
                  ],
                ),
              ),
            ),
          );
        }

        final postIndex = index - 1;
        return PostCard(
          post: _posts[postIndex],
          onLikeToggle: () => _toggleReaction(postIndex),
          onReactionTap: () => _openReactionBottomSheet(postIndex),
          onCommentTap: () => _openDiscussion(postIndex),
          onTap: () => _openDiscussion(postIndex),
          onOptionSelected: (action) {
            if (action == 'report') {
              _handleReport(postIndex);
            } else if (action == 'block') {
              _handleBlock(postIndex);
            }
          },
        );
      },
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final bool isSelected = _currentNavIndex == index;

    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: () {
        HapticFeedback.lightImpact();
        setState(() {
          _currentNavIndex = index;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.surfaceLight.withValues(alpha: 0.6) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected ? AppColors.bellGold : AppColors.textSecondary,
              size: 22,
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? AppColors.bellGold : AppColors.textMuted,
                fontSize: 10.5,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
