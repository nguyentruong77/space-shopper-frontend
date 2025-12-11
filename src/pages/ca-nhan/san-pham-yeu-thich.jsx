import { Paginate } from '@/components/Paginate'
import { ListProductCard } from '@/components/ProductCard'
import { useQuery } from '@/hooks/useQuery'
import { useSearch } from '@/hooks/useSearch'
import { productService } from '@/services/product'
import queryString from 'query-string'
import { Helmet } from 'react-helmet'

export const WishlistPage = () => {
    const [search] = useSearch({
        page: 1
    })
    const qs = queryString.stringify({
        page: search?.page
    })
    const { loading, data, refetch: fetchWishlist, clearPreviousData } = useQuery({
        queryKey: [qs],
        queryFn: () => productService.getWishlist(`?${qs}`),
        keepPreviousData: true,
    })
    return (
        <>
            <Helmet>
                <title>Sản phẩm yêu thích</title>
            </Helmet>
            <div>
                {/* Products */}
                <div className="row">
                    <ListProductCard
                        data={data?.data}
                        loading={loading}
                        loadingCount={15}
                        onRemoveWishlistSuccess={() => {
                            clearPreviousData()
                            fetchWishlist()
                        }}
                        showRemove
                    />
                </div>
                {/* Pagination */}
                <Paginate totalPage={data?.paginate.totalPage} />
            </div>

        </>
    )
}
