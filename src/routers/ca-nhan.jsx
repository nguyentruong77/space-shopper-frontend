import { PATH } from "@/config";
import { ProfileLayout } from "@/layouts/ProfileLayout";
import { ProfilePage } from "@/pages/ca-nhan";
import { OrderPage } from "@/pages/ca-nhan/don-hang";
import { OrderDetailPage } from "@/pages/ca-nhan/don-hang/[id]";
import { WishlistPage } from "@/pages/ca-nhan/san-pham-yeu-thich";
import { AddressPage } from "@/pages/ca-nhan/so-dia-chi";
import { ActionAddressPage } from "@/pages/ca-nhan/so-dia-chi/action";
import { PaymentPage } from "@/pages/ca-nhan/so-thanh-toan";
import { ActionPaymentPage } from "@/pages/ca-nhan/so-thanh-toan/action";

export const profile = [
    {
        element: <ProfileLayout />,
        children: [
            {
                element: <ProfilePage />,
                //index: true,
                path: PATH.Profile.index,
                handle: { title: "Thông tin cá nhân" },
            },
            {
                element: <WishlistPage />,
                path: PATH.Profile.Wishlist,
                handle: { title: "Sản phẩm yêu thích" },
            },
            {
                element: <OrderPage />,
                path: PATH.Profile.Order,
                handle: { title: "Theo dõi đơn hàng" },
            },
            {
                element: <OrderDetailPage />,
                path: PATH.Profile.OrderDetail,
                handle: { title: "Theo dõi đơn hàng" },
            },
            {
                element: <AddressPage />,
                path: PATH.Profile.Address,
                handle: { title: "Sổ địa chỉ" },
            },
            {
                element: <ActionAddressPage />,
                path: PATH.Profile.NewAddress,
                handle: { title: "Thêm địa chỉ" },
            },
            {
                element: <ActionAddressPage />,
                path: PATH.Profile.EditAddress,
                handle: { title: "Cập nhật địa chỉ" },
            },
            {
                element: <PaymentPage />,
                path: PATH.Profile.Payment,
                handle: { title: "Sổ thanh toán" },
            },
            {
                element: <ActionPaymentPage />,
                path: PATH.Profile.NewPayment,
                handle: { title: "Thêm thẻ thanh toán" },
            },
            {
                element: <ActionPaymentPage />,
                path: PATH.Profile.EditPayment,
                handle: { title: "Cập thẻ thanh toán" },
            },
        ]
    }
]