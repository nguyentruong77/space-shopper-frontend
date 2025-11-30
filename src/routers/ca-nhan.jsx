import { PATH } from "@/config";
import { ProfileLayout } from "@/layouts/ProfileLayout";
import { ProfilePage } from "@/pages/ca-nhan";
import { OrderPage } from "@/pages/ca-nhan/don-hang";
import { WishlistPage } from "@/pages/ca-nhan/san-pham-yeu-thich";

export const profile = [
    {
        element: <ProfileLayout />,
        children: [
            {
                element: <ProfilePage />,
                index: true,
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
                PATH: PATH.Profile.Order,
                handle: { title: "Theo dõi đơn hàng" },
            }
        ]
    }
]