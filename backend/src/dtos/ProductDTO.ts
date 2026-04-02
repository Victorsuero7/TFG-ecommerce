import { Product } from "../Models/product.entity";
import { Category } from "../Models/category.entity";
import { User } from "../Models/user.entity";
import { UserDTO } from "./UserDTO";

/**
 * DTO para productos.
 */
export class ProductDTO {

    /** Identificador del producto.  */
    public id?: number
    /** Nombre del producto. */
    public name?: string
    /** Descripción del producto. */
    public description?: string
    /** Precio del producto. */
    public price?: number
    /** Tamaño o formato del producto. */
    public size?: string
    /** Stock disponible del producto. */
    public stock?: number
    /** Url de la imagen del producto. */
    public imageUrl?: string | undefined
    /** Fecha de la última modificación. */
    public lastModification?: Date
    /** Usuario que realizó la última modificación. */
    public modifiedBy?: string
    /** Categoría a la que pertenece el producto. */
    public category?: Category
    constructor(

    ) { }

    /**
     * Convierte una entidad Product en ProductDTO.
     * 
     * @param product Entidad product obtenida en la base de datos.
     * @returns Devuelve un ProductDTO con los datos del producto.
     */
    static fromEntity(product: Product): ProductDTO {
        const dto = new ProductDTO()
        dto.id = product.id
        dto.name = product.name
        dto.description = product.description
        dto.price = product.price
        dto.size = product.size
        dto.stock = product.stock
        dto.imageUrl = product?.imageUrl
        dto.lastModification = product.lastModification
        dto.modifiedBy = product.modifiedBy?.email
        dto.category = product.category
        return dto
    }

    /**
     * Convierte el DTO actual en una entidad Product.
     * 
     * @returns Devuelve una entidad Product.
     */
    public toEntity(): Product {
        const entity = new Product()
        Object.assign(entity, this)
        return entity
    }

    /**
     * Crea un ProductDTO a partir de un objeto recibido, normalmente
     * a través de una petición HTTP.
     * 
     * @param object Objeto con los datos del producto. 
     * @param path Ruta de la imagen subida (es opcional).
     * @returns Devuelve un nuevo ProductDTO.
     */
    static createDTO(object: { [key: string]: any }, path?: string | undefined): ProductDTO {
        const { id, name, description, price, size, stock, categoryId } = object;
        const dto = new ProductDTO()
        dto.id = Number(id)
        dto.name = name
        dto.description = description
        dto.price = price
        dto.size = size
        dto.stock = stock
        dto.category = categoryId
        dto.imageUrl = path  
        return dto
    }
}