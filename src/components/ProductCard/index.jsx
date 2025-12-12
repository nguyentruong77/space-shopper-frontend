import { PATH } from '@/config'
import { useAction } from '@/hooks/useAction'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useCategory } from '@/hooks/useCategories'
import { productService } from '@/services/product'
import { updateCardItemAction } from '@/stores/cart'
import { cn, currency } from '@/utils'
import { withListLoading } from '@/utils/withListLoading'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { PopConfirm } from '../PopConfirm'
import { Rating } from '../Rating'
import { Skeleton } from '../Skeleton'

const ProductCard = ({ className = "", onRemoveWishlistSuccess, showRemove, showWishlist, id, slug, images, categories, name, price, real_price, discount_rate, review_count, rating_average }) => {
    const img1 = images?.[0]?.thumbnail_url
    const img2 = images?.[1] ? images?.[1]?.thumbnail_url : img1
    const category = useCategory(categories)
    const navigate = useNavigate()
    const { user } = useAuth()
    const { cart } = useCart()
    const dispatch = useDispatch();

    const onAddWishlist = useAction({
        service: () => productService.addWishlist(id),
        loadingMessage: `Đang thêm sản phẩm "${name}" vào yêu thích`,
        successMessage: `Thêm sản phẩm "${name}" vào yêu thích thành công`,
    })

    const onRemoveWishlist = useAction({
        service: () => productService.removeWishlist(id),
        loadingMessage: `Đang xóa sản phẩm "${name}" khỏi yêu thích`,
        successMessage: `Xóa sản phẩm "${name}" khỏi yêu thích thành công`,
        onSuccess: () => onRemoveWishlistSuccess?.()
    })

    const onAddCardItem = () => {
        if (user) {
            const { listItems } = cart
            const product = listItems.find(e => e.productId === id)

            dispatch(updateCardItemAction({
                productId: id,
                quantity: product?.quantity ? product?.quantity + 1 : 1,
                showPopOver: true,
            }))
        } else {
            navigate(PATH.Account)
        }
    }
    return (
        <div className={cn("col-6 col-md-4", className)}>
            {/* Card */}
            <div className="product-card card mb-7">
                {/* Badge */}
                {discount_rate > 0 && <div className="card-sale badge badge-dark card-badge card-badge-left text-uppercase">
                    -{discount_rate}%
                </div>}
                {/* Image */}
                <div className="card-img">
                    {/* Image */}
                    <Link className="card-img-hover" to={`/${slug}`}>
                        <img className="card-img-top card-img-back" src={img1} alt="..." />
                        <img className="card-img-top card-img-front" src={img2} alt="..." />
                    </Link>
                    {/* Actions */}
                    <div className="card-actions">
                        <span className="card-action">
                        </span>
                        <span className="card-action">
                            <button onClick={onAddCardItem} className="btn btn-xs btn-circle btn-white-primary" data-toggle="button">
                                <i className="fe fe-shopping-cart" />
                            </button>
                        </span>
                        {
                            <PopConfirm
                                disabled={!!user}
                                title="Thông báo"
                                description="Vui lòng đăng nhặp trước khi đưa sản phẩm vào yêu thích"
                                onConfirm={() => navigate(PATH.Account)}
                                okText="Đăng nhập"
                                showCancel={false}>
                            </PopConfirm>
                        }
                        {
                            showWishlist &&
                            <span className="card-action">
                                <button onClick={() => user ? onAddWishlist() : undefined} className="btn btn-xs btn-circle btn-white-primary" data-toggle="button">
                                    <i className="fe fe-heart" />
                                </button>
                            </span>
                        }
                        {
                            showRemove &&
                            <span className="card-action">
                                <button onClick={onRemoveWishlist} className="btn btn-xs btn-circle btn-white-primary" data-toggle="button">
                                    <i className="fe fe-x" />
                                </button>
                            </span>
                        }
                    </div>
                </div>
                {/* Body */}
                <div className="card-body px-0">
                    {/* Category */}
                    <div className="card-product-category font-size-xs">
                        {
                            category && <a className="text-muted" href="#">{category.title}</a>
                        }
                    </div>
                    {/* Title */}
                    <div className="card-product-title font-weight-bold">
                        <a className="text-body card-product-name" href="#">{name}</a>
                    </div>
                    <div className="card-product-rating">
                        {
                            review_count > 0 && <>
                                {rating_average}
                                <Rating value={rating_average} />
                                ({review_count} review)
                            </>
                        }
                    </div>
                    {/* Price */}
                    <div className="card-product-price">
                        {
                            real_price < price ? <>
                                <span className="text-primary sale">{currency(real_price)}</span>
                                <span className="font-size-xs text-gray-350 text-decoration-line-through ml-1">{currency(price)}</span>
                            </> : <>
                                <span className="text-xl flex h-full items-end">{currency(real_price)}</span>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

const ProductCardLoading = ({ className }) => {
    return (
        <div className={cn("col-6 col-md-4", className)}>
            {/* Card */}
            <div className="product-card card mb-7">
                {/* Image */}
                <div className="card-img">
                    {/* Image */}
                    <a className="card-img-hover" href="#">
                        <Skeleton height={300} />
                    </a>
                </div>
                {/* Body */}
                <div className="card-body px-0">
                    {/* Category */}
                    <div className="card-product-category font-size-xs">
                        <a className="text-muted" href="#"><Skeleton height="100%" width={150} /></a>
                    </div>
                    {/* Title */}
                    <div className="card-product-title font-weight-bold">
                        <a className='text-body card-product-name' href='#'><Skeleton height="100%" /></a>
                    </div>
                    {/* Rating */}
                    <div className="card-product-rating">
                        <Skeleton height="100%" width={150} />
                    </div>
                    {/* Price */}
                    <div className="card-product-price">
                        <Skeleton height="100%" width={100} />
                    </div>
                </div>
            </div>
        </div>

    )
}

export const ListProductCard = withListLoading(ProductCard, ProductCardLoading)
