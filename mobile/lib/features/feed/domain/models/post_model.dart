class PostModel {
  final String id;
  final String authorName;
  final String authorAvatar;
  final bool isVerified;
  final String createdAtText;
  final String content;
  final String? giftCode;
  final int likesCount;
  final int reactionsCount;
  final int commentsCount;
  final String userReaction; // '', 'like', 'wow', 'haha'

  const PostModel({
    required this.id,
    required this.authorName,
    required this.authorAvatar,
    this.isVerified = true,
    required this.createdAtText,
    required this.content,
    this.giftCode,
    this.likesCount = 0,
    this.reactionsCount = 0,
    this.commentsCount = 0,
    this.userReaction = '',
  });

  PostModel copyWith({
    String? userReaction,
    int? likesCount,
    int? reactionsCount,
    int? commentsCount,
  }) {
    return PostModel(
      id: id,
      authorName: authorName,
      authorAvatar: authorAvatar,
      isVerified: isVerified,
      createdAtText: createdAtText,
      content: content,
      giftCode: giftCode,
      likesCount: likesCount ?? this.likesCount,
      reactionsCount: reactionsCount ?? this.reactionsCount,
      commentsCount: commentsCount ?? this.commentsCount,
      userReaction: userReaction ?? this.userReaction,
    );
  }
}
