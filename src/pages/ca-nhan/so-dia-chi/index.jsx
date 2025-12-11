import { ListAddressCard } from '@/components/AddressCard'
import { PATH } from '@/config'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

export const AddressPage = () => {
    const { loading, data, refetch } = useQuery({
        queryFn: () => userService.getAddress(),
        onSuccess: (res) => {
            res.data.sort(e => e.default ? -1 : 0)
        }
    })
    return (
        <div className="row">
            <Helmet>
                <title>Sổ địa chỉ</title>
            </Helmet>
            <ListAddressCard
                data={data?.data}
                loading={!data?.data && loading}
                empty={<div className='col-12'><p>Bạn không có sổ địa chỉ nào hết, vui lòng thêm địa chỉ</p></div>}
                onChangeAddressDefault={refetch}
                onDeleteAddress={refetch}
            />
            <div className="col-12">
                {/* Button */}
                <Link className="btn btn-block btn-lg btn-outline-border" to={PATH.Profile.NewAddress}>
                    Add Address <i className="fe fe-plus" />
                </Link>
            </div>
        </div>

    )
}
