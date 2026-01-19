import React, { useEffect, useState } from 'react'
import type Category from '../models/Category';
import useAxios from '../hooks/useAxios';
import CategoriesList from '../components/CategoriesList';
import CategoriesForm from '../components/CategoriesForm';

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>();

  const {response, error, loading} = useAxios<Category[]>({
    url: "categories",
    method: "get"
  });  

  useEffect(() => {
    if (response == null)
    {
        return;
    }
    setCategories(response);
  }, [response]);

  if (error)
  {
    console.log(error);    
  }

  if (loading) {
    return <p>Loading...</p>;  
  }

  return (
    <div>
      <CategoriesForm setCategories={setCategories}/>

      <CategoriesList categories={categories} setCategories={setCategories} />
    </div>
  )

  return (
    <div>
      
    </div>
  )
}

export default CategoryManagement
