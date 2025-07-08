import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import appwriteService from '../config/service';
import { useToast } from './ToastContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { showToast } = useToast();
  const [menus, setMenus] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch menus from Appwrite
  const fetchMenus = useCallback(async () => {
    try {
      const menuData = await appwriteService.getMenus();
      // Transform data to match expected format
      const transformedMenus = menuData.map(menu => ({
        ...menu,
        MenuID: menu.menuId || menu.$id,
        Name: menu.name,
        Description: menu.description,
        Icon: menu.icon,
        CreatedAt: menu.createdAt || menu.$createdAt
      }));
      setMenus(transformedMenus);
      return transformedMenus;
    } catch (error) {
      console.error('Error fetching menus:', error);
      setError('Failed to load menus');
      return [];
    }
  }, []);

  // Fetch dishes from Appwrite
  const fetchDishes = useCallback(async () => {
    try {
      const dishData = await appwriteService.getDishes();
      // Transform data to match expected format
      const transformedDishes = dishData.map(dish => ({
        ...dish,
        DishID: dish.dishId || dish.$id,
        Name: dish.name,
        Description: dish.description,
        Price: dish.price,
        MenuID: dish.menuId,
        Type: dish.type, // veg/nonVeg enum
        Image: dish.imgUrl,
        IsAvailable: dish.isAvailable,
        CreatedAt: dish.createdAt || dish.$createdAt
      }));
      setDishes(transformedDishes);
      return transformedDishes;
    } catch (error) {
      console.error('Error fetching dishes:', error);
      setError('Failed to load dishes');
      return [];
    }
  }, []);

  // Get dishes by menu ID
  const getDishesByMenu = useCallback((menuId) => {
    return dishes.filter(dish => dish.MenuID === menuId);
  }, [dishes]);

  // Get dish by ID
  const getDishById = useCallback((dishId) => {
    return dishes.find(dish => dish.DishID === dishId);
  }, [dishes]);

  // Initial data loading
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load menus and dishes in parallel
      await Promise.all([
        fetchMenus(),
        fetchDishes()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Failed to load application data');
      showToast('Failed to load application data', 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchMenus, fetchDishes, showToast]);

  // Load data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  const value = {
    // Data
    menus,
    dishes,
    loading,
    error,
    
    // Functions
    fetchMenus,
    fetchDishes,
    getDishesByMenu,
    getDishById,
    refreshData,
    loadInitialData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
