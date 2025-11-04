import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './repository/products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}
  create(createProductDto: CreateProductDto) {
    const createProduct = this.productsRepository.create(createProductDto);
    if (!createProduct) {
      throw new BadRequestException('El nombre, el precio y el stock son obligatorios');
    }
    return createProduct;
  }

  findAll() {
    return this.productsRepository.findAll();
  }

  findOne(id: string) {
    const productExists = this.productsRepository.findOne(id);
    if (!productExists) {
      throw new BadRequestException('Product not found');
    }
    return productExists;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const productExists = this.productsRepository.findOne(id);
    if (!productExists) {
      throw new BadRequestException('Product not found');
    }
    return this.productsRepository.update(id, updateProductDto);
  }

  remove(id: string) {
    const productExists = this.productsRepository.findOne(id);
    if (!productExists) {
      throw new BadRequestException('Product not found');
    }
    return this.productsRepository.remove(id);
  }
}
