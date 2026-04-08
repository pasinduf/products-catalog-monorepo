export interface CategoryDto {
  id: string;
  name: string;
  description: string;
}


export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  categoryId: string;
  category: CategoryDto;
}
