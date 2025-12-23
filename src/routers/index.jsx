import PrivateRoute from "@/components/PrivateRoute";
import { PATH } from "@/config";
import { MainLayout } from "@/layouts/MainLayout";
import HomePage from "@/pages";
import { Page404 } from "@/pages/404";
import { ProductDetailPage } from "@/pages/[slug]";
import { ProductPage } from "@/pages/san-pham";
import { profile } from "./ca-nhan";
import GuestRoute from "@/components/GuestRoute";
import { AccountPage } from "@/pages/tai-khoan";
import { createBrowserRouter } from "react-router-dom";
import { ViewCart } from "@/pages/gio-hang";
import { Checkout } from "@/pages/checkout";
import { OrderComplete } from "@/pages/dat-hang-thanh-cong";
import { ResetPasswordPage } from "@/pages/reset-password";
import { ContactPage } from "@/pages/contact";
import { FAQPage } from "@/pages/cau-hoi-thuong-gap";
import { ShippingAndReturnPage } from "@/pages/quy-dinh-giao-hang-va-tra-hang";

const routes = [
    {
        element: <MainLayout />,
        children: [
            {
                element: <HomePage />,
                path: PATH.Home,
            },
            {
                element: <ProductPage />,
                path: PATH.Product,
            },
            {
                element: <ProductPage />,
                path: PATH.Category,
            },
            {
                element: <ProductDetailPage />,
                path: PATH.ProductDetail,
            },
            {
                element: <ViewCart />,
                path: PATH.ViewCart,
            },
            {
                element: <Checkout />,
                path: PATH.Checkout,
            },
            {
                element: <OrderComplete />,
                path: PATH.OrderComplete,
            },
            {
                element: <ContactPage />,
                path: PATH.Contact,
            },
            {
                element: <FAQPage />,
                path: PATH.FAQ,
            },
            {
                element: <ShippingAndReturnPage />,
                path: PATH.ShippingAndReturn,
            },
            {
                element: <PrivateRoute redirect={PATH.Account} />,
                children: profile,
            },
            {
                element: <GuestRoute redirect={PATH.Profile.index} />,
                children: [
                    {
                        element: <AccountPage />,
                        path: PATH.Account,
                    },
                    {
                        element: <ResetPasswordPage />,
                        path: PATH.ResetPassword,
                    }
                ],
            },
            {
                element: <Page404 />,
                path: "*",
            }
        ]
    }
]

export const router = createBrowserRouter(routes)