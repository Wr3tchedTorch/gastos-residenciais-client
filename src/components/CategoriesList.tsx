import React from 'react'
import type Category from '../models/Category';
import CategoriesTable from './CategoriesTable';

interface CategoriesListProps {
  categories: Category[] | undefined;
  setCategories: React.Dispatch<React.SetStateAction<Category[] | undefined>>;
}

const CategoriesList = ({ categories, setCategories }: CategoriesListProps) => {
  if (!categories)
  {
    <p>Os dados não puderam ser carregados</p>;
    return;
  }

  return (
    <div>
      <CategoriesTable 
        categories={categories} 
        setCategories={setCategories} 
      />
    </div>
  )
}

export default CategoriesList
