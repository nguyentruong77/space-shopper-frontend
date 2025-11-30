import { Paginate } from '@/components/Paginate'
import { ProductCard, ProductCardLoading } from '@/components/ProductCard'
import { useQuery } from '@/hooks/useQuery'
import { useSearch } from '@/hooks/useSearch'
import { productService } from '@/services/product'
import queryString from 'query-string'
import React from 'react'

export const WishlistPage = () => {
    const { search } = useSearch({
        page: 1
    })
    const qs = queryString.stringify({
        page: search.page
    })
    const { loading, data, refetch: fetchWishlist, clearPreviousData } = useQuery({
        queryKey: [qs],
        queryFn: () => productService.getWishlist(`?${qs}`)
    })
    return (
        <>
            <div>
                {/* Products */}
                <div className="row">
                    {
                        loading ? Array.from(Array(15)).map((_, i) => <ProductCardLoading key={i} />) :
                            data.data.map((item) => <ProductCard onRemoveWishlistSuccess={() => {
                                clearPreviousData()
                                fetchWishlist()
                            }} showRemove key={item.id} {...item} />)
                    }
                </div>
                {/* Pagination */}
                <Paginate totalPage={data?.paginate.totalPage} />
            </div>

        </>
    )
}
