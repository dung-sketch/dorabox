import 'package:flutter/material.dart';

/// Bảng màu Doraemon Luxe Theme cho Dorabox
/// Phối hợp giữa Midnight Navy, Dora Bell Gold, Doraemon Blue và Collar Red
class AppColors {
  // Nền chính (Deep Dark Navy)
  static const Color background = Color(0xFF0A0E17);
  static const Color backgroundSecondary = Color(0xFF101726);

  // Thẻ & Bề mặt (Cards & Glass Surfaces)
  static const Color surface = Color(0xFF141C2E);
  static const Color surfaceSecondary = Color(0xFF182236);
  static const Color surfaceLight = Color(0xFF1C273E);
  static const Color surfaceGlass = Color(0xCC111827); // 80% opacity cho liquid glass

  // Điểm nhấn chính: Chuông Vàng Doraemon (Dora Bell Gold)
  static const Color bellGold = Color(0xFFFFC837);
  static const Color bellGoldLight = Color(0xFFFFD966);
  static const Color bellGoldDark = Color(0xFFE5B020);

  // Xanh Doraemon (Brand Blue)
  static const Color doraemonBlue = Color(0xFF0084FF);
  static const Color doraemonBlueSoft = Color(0xFF2E9BFF);

  // Đỏ Vòng Cổ (Collar Scarlet Red - dùng cho Tim, Badge Thông báo)
  static const Color collarRed = Color(0xFFFF3B30);
  static const Color collarRedDark = Color(0xFFD32F2F);

  // Chữ & Biểu tượng (Typography)
  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);

  // Viền & Kính Lỏng (Borders & Shimmers)
  static const Color border = Color(0xFF1E293B);
  static const Color borderLight = Color(0x28FFFFFF);
  static const Color borderGold = Color(0x66FFC837);
}
