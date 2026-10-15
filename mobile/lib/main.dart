import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/theme/app_colors.dart';
import 'features/feed/presentation/feed_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Tối ưu hóa đặc biệt cho Android: Edge-to-Edge trong suốt
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarIconBrightness: Brightness.light,
      systemNavigationBarDividerColor: Colors.transparent,
    ),
  );

  runApp(const DoraboxApp());
}

class DoraboxApp extends StatelessWidget {
  const DoraboxApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dorabox',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        primaryColor: AppColors.doraemonBlue,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.bellGold,
          secondary: AppColors.doraemonBlue,
          surface: AppColors.surface,
          error: AppColors.collarRed,
        ),
        // Sử dụng typography hiện đại, tự nhiên, không rập khuôn
        textTheme: GoogleFonts.interTextTheme(
          ThemeData.dark().textTheme,
        ).apply(
          bodyColor: AppColors.textPrimary,
          displayColor: AppColors.textPrimary,
        ),
        splashFactory: InkSparkle.splashFactory, // Android 12+ Material You ripple
      ),
      home: const FeedScreen(),
    );
  }
}
