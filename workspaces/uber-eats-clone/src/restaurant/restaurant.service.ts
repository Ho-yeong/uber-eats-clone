import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/retaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { User } from '../users/entities/user.entity';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { CategoryRepository } from './repositories/category.repository';
import { Category } from './entities/category.entity';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { AllCategoryOutput } from './dtos/all-category.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dtos/search-restaurant.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { Dish } from './entities/dish.entity';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { MyRestaurantsOutPut } from './dtos/my-restaurants.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) private readonly restaurant: Repository<Restaurant>,
    @InjectRepository(Dish) private readonly dishes: Repository<Dish>,
    private readonly categories: CategoryRepository,
  ) {}

  async myRestaurants(owner: User): Promise<MyRestaurantsOutPut> {
    try {
      const restaurants = await this.restaurant.find({ owner });

      return {
        ok: true,
        restaurants,
      };
    } catch (err) {
      return {
        ok: false,
        error: "Couldn't find restaurants",
      };
    }
  }

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurant.create(createRestaurantInput);
      newRestaurant.owner = owner;

      const category = await this.categories.getOrCreate(createRestaurantInput.categoryName);

      newRestaurant.category = category;

      await this.restaurant.save(newRestaurant);
      return { ok: true, restaurantId: newRestaurant.id };
    } catch (err) {
      return { ok: false, error: "Couldn't create a restaurant" };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurant.findOne(editRestaurantInput.restaurantId, {
        loadRelationIds: true,
      });
      if (!restaurant) {
        return { ok: false, error: 'Restaurant Not Found' };
      }
      if (owner.id !== restaurant.ownerId) {
        return { ok: false, error: "You can't edit a restaurant that you don't own" };
      }

      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreate(editRestaurantInput.categoryName);
      }
      await this.restaurant.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);

      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Couldn't edit a restaurant" };
    }
  }

  async deleteRestaurant(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurant.findOne(restaurantId, {
        loadRelationIds: true,
      });
      if (!restaurant) {
        return { ok: false, error: 'Restaurant Not Found' };
      }
      if (owner.id !== restaurant.ownerId) {
        return { ok: false, error: "You can't edit a restaurant that you don't own" };
      }

      await this.restaurant.delete(restaurantId);

      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Couldn't delete a restaurant" };
    }
  }

  async allCategories(): Promise<AllCategoryOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch (err) {
      return { ok: false, error: "Couldn't load categories" };
    }
  }

  countRestaurants(category: Category) {
    return this.restaurant.count({ category });
  }

  async findCategoryBySlug({ slug, page }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({ slug });
      if (!category) {
        return { ok: false, error: 'Category Not Found' };
      }

      const restaurants = await this.restaurant.find({
        where: { category },
        take: 25,
        skip: (page - 1) * 25,
        order: { isPromoted: 'DESC' },
      });

      const totalResults = await this.countRestaurants(category);

      return { ok: true, category, totalPages: Math.ceil(totalResults / 25), restaurants };
    } catch (err) {
      return { ok: false, error: "Couldn't load category" };
    }
  }

  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurant.findAndCount({
        take: 3,
        skip: (page - 1) * 3,
        // relations: ['owner', 'menu', 'orders'],
        order: { isPromoted: 'DESC' },
      });
      return {
        ok: true,
        results: restaurants,
        totalPages: Math.ceil(totalResults / 3),
        totalResults,
      };
    } catch (err) {
      return { ok: false, error: "Couldn't load restaurants" };
    }
  }

  async findRestaurantById({ restaurantId }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurant.findOne(restaurantId, {
        relations: ['menu', 'orders'],
      });
      if (!restaurant) {
        return { ok: false, error: 'Restaurant Not Found' };
      }

      return { ok: true, restaurant };
    } catch (err) {
      return { ok: false, error: "Couldn't find a restaurant" };
    }
  }

  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      // for mysql = Raw(name => `${name} LIKE BINARY '%${query}%'`)
      const [restaurants, totalResults] = await this.restaurant.findAndCount({
        where: { name: Raw(name => `${name} ILIKE '%${query}%'`) },
        take: 25,
        skip: (page - 1) * 25,
      });
      return { ok: true, restaurants, totalResults, totalPages: Math.ceil(totalResults / 25) };
    } catch (err) {
      return { ok: false, error: "Couldn't search for restaurants" };
    }
  }

  async createDish(owner: User, createDishInput: CreateDishInput): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurant.findOne(createDishInput.restaurantId);
      if (!restaurant) {
        return { ok: false, error: 'Restaurant Not Found' };
      }
      if (owner.id !== restaurant.ownerId) {
        return { ok: false, error: 'You are not a owner' };
      }
      const dish = await this.dishes.save(this.dishes.create({ ...createDishInput, restaurant }));
      console.log(dish);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Couldn't create a dish" };
    }
  }

  async editDish(owner: User, editDishInput: EditDishInput): Promise<EditDishOutput> {
    try {
      const dish = await this.dishes.findOne(editDishInput.dishId, { relations: ['restaurant'] });
      if (!dish) {
        return { ok: false, error: 'Dish not found' };
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return { ok: false, error: 'You are not a owner' };
      }
      await this.dishes.save([
        {
          id: editDishInput.dishId,
          ...editDishInput,
        },
      ]);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Couldn't edit a dish" };
    }
  }

  async deleteDish(owner: User, { dishId }: DeleteDishInput): Promise<DeleteDishOutput> {
    try {
      const dish = await this.dishes.findOne(dishId, { relations: ['restaurant'] });
      if (!dish) {
        return { ok: false, error: 'Dish not found' };
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return { ok: false, error: 'You are not a owner' };
      }
      await this.dishes.delete(dishId);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Couldn't delete a dish" };
    }
  }
}
