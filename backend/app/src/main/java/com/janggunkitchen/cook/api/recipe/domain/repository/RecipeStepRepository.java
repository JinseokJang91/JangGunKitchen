package com.janggunkitchen.cook.api.recipe.domain.repository;

import com.janggunkitchen.cook.api.recipe.domain.entity.Recipe;
import com.janggunkitchen.cook.api.recipe.domain.entity.RecipeDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeStepRepository extends JpaRepository<RecipeDetail, Long> {
    void deleteAllByRecipe(Recipe recipe);
}
