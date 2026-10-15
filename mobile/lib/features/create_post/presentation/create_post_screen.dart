import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/liquid_glass.dart';

class CreatePostScreen extends StatefulWidget {
  const CreatePostScreen({super.key});

  @override
  State<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends State<CreatePostScreen> {
  final TextEditingController _contentController = TextEditingController();
  final TextEditingController _linkController = TextEditingController();
  bool _agreeRules = false;
  bool _showLinkInput = false;
  final List<String> _selectedImages = [];
  int _charCount = 0;

  @override
  void initState() {
    super.initState();
    _contentController.addListener(() {
      setState(() {
        _charCount = _contentController.text.length;
      });
    });
  }

  @override
  void dispose() {
    _contentController.dispose();
    _linkController.dispose();
    super.dispose();
  }

  bool get _canSubmit =>
      _contentController.text.trim().isNotEmpty && _agreeRules;

  void _handleSubmit() {
    if (!_canSubmit) return;
    HapticFeedback.mediumImpact();

    // Giả lập lưu bài viết thành công
    Navigator.of(context).pop(_contentController.text.trim());
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
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Bài viết mới',
          style: TextStyle(
            color: AppColors.textPrimary,
            fontSize: 20,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Text Area nhập nội dung bài viết
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface.withValues(alpha: 0.6),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.08),
                  width: 1,
                ),
              ),
              child: Column(
                children: [
                  TextField(
                    controller: _contentController,
                    maxLines: 7,
                    maxLength: 5000,
                    buildCounter: (context, {required currentLength, required isFocused, maxLength}) => null,
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 16,
                      height: 1.5,
                    ),
                    decoration: const InputDecoration(
                      hintText: 'Bạn đang nghĩ gì hôm nay?\nHãy chia sẻ với cộng đồng Dorabox...',
                      hintStyle: TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 15,
                        height: 1.5,
                      ),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
                  Align(
                    alignment: Alignment.bottomRight,
                    child: Text(
                      '$_charCount/5000',
                      style: const TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 12.5,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Nút thêm liên kết HTTPS
            LiquidGlassContainer(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              borderRadius: 14,
              blurSigma: 10,
              onTap: () {
                setState(() {
                  _showLinkInput = !_showLinkInput;
                });
              },
              child: Row(
                children: [
                  const Icon(Icons.link_rounded, color: AppColors.textSecondary, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      _linkController.text.isNotEmpty
                          ? _linkController.text
                          : 'Liên kết HTTPS (không bắt buộc)',
                      style: TextStyle(
                        color: _linkController.text.isNotEmpty
                            ? AppColors.doraemonBlue
                            : AppColors.textSecondary,
                        fontSize: 14.5,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),

            if (_showLinkInput) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: AppColors.surfaceSecondary,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: TextField(
                  controller: _linkController,
                  style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
                  decoration: const InputDecoration(
                    hintText: 'https://...',
                    hintStyle: TextStyle(color: AppColors.textMuted),
                    border: InputBorder.none,
                  ),
                ),
              ),
            ],

            const SizedBox(height: 14),

            // Nút Thêm ảnh (0/4)
            InkWell(
              onTap: () {
                HapticFeedback.lightImpact();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Tính năng chọn ảnh & nén WebP tự động lên Cloudflare R2!'),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
              borderRadius: BorderRadius.circular(14),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: AppColors.bellGold.withValues(alpha: 0.45),
                    width: 1.2,
                  ),
                  color: AppColors.surface.withValues(alpha: 0.3),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.add_photo_alternate_outlined,
                      color: AppColors.bellGold,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Thêm ảnh (${_selectedImages.length}/4)',
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Quy tắc cộng đồng
            Text(
              'Tôn trọng người khác. Không đăng nội dung quấy rối, thù ghét, tình dục, lừa đảo hoặc vi phạm bản quyền. Bài đăng hiển thị với các thành viên cộng đồng và có thể bị gỡ khi vi phạm.',
              style: TextStyle(
                color: AppColors.textMuted.withValues(alpha: 0.9),
                fontSize: 13,
                height: 1.45,
              ),
            ),

            const SizedBox(height: 16),

            // Checkbox đồng ý điều khoản
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Text(
                    'Tôi đồng ý quy tắc cộng đồng và có quyền chia sẻ nội dung này.',
                    style: TextStyle(
                      color: _agreeRules ? AppColors.textPrimary : AppColors.textSecondary,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      height: 1.35,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                InkWell(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    setState(() {
                      _agreeRules = !_agreeRules;
                    });
                  },
                  child: Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                        color: _agreeRules ? AppColors.bellGold : AppColors.textMuted,
                        width: 1.8,
                      ),
                      color: _agreeRules ? AppColors.bellGold : Colors.transparent,
                    ),
                    child: _agreeRules
                        ? const Icon(Icons.check, color: AppColors.background, size: 18)
                        : null,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 28),

            // Nút Đăng bài
            InkWell(
              onTap: _canSubmit ? _handleSubmit : null,
              borderRadius: BorderRadius.circular(14),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(vertical: 15),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(14),
                  color: _canSubmit
                      ? AppColors.bellGold
                      : AppColors.surfaceLight.withValues(alpha: 0.5),
                  boxShadow: _canSubmit
                      ? [
                          BoxShadow(
                            color: AppColors.bellGold.withValues(alpha: 0.3),
                            blurRadius: 16,
                            offset: const Offset(0, 4),
                          )
                        ]
                      : [],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.send_rounded,
                      color: _canSubmit ? AppColors.background : AppColors.textMuted,
                      size: 18,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Đăng bài',
                      style: TextStyle(
                        color: _canSubmit ? AppColors.background : AppColors.textMuted,
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
