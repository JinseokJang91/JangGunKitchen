package com.janggunkitchen.cook.api.recommendation.dto;

import com.janggunkitchen.common.domain.entity.Member;
import com.janggunkitchen.cook.api.recipe.domain.entity.Recipe;
import com.janggunkitchen.cook.api.recipe.dto.RecipeCategoryDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendedRecipeDto {
    private Long id;
    private String title;
    private String description;
    private String thumbnail;
    private Long memberId;
    private String memberNickname;
    private String memberProfileImage;
    private Long hits;
    private List<RecipeCategoryDto> categories;
    private Integer commentCount;
    private Integer favoriteCount;
    private LocalDateTime createdAt;
    private String recommendReason; // 추천 이유

    public static RecommendedRecipeDto from(Recipe recipe, String recommendReason, Integer favoriteCount, Member member) {
        return RecommendedRecipeDto.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .thumbnail(recipe.getThumbnail())
                .memberId(recipe.getMemberId())
                .memberNickname(member != null ? member.getNickname() : null)
                .memberProfileImage(member != null ? member.getProfileImage() : null)
                .hits(recipe.getHits())
                .categories(recipe.getRecipeCategories().stream()
                        .map(RecipeCategoryDto::fromEntity)
                        .collect(Collectors.toList()))
                .commentCount(recipe.getRecipeComments().size())
                .favoriteCount(favoriteCount)
                .createdAt(recipe.getCreatedAt())
                .recommendReason(recommendReason)
                .build();
    }
}
