import { PATH } from "@/config";
import { Profile } from "@/pages/ca-nhan";
import { Order } from "@/pages/ca-nhan/don-hang";

export const profile = [
    {
        element: <Profile />,
        index: true,
    },
    {
        element: <Order />,
        PATH: PATH.Profile.Order,
    }
]