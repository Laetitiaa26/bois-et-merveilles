import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { AccountPage } from "./pages/AccountPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminProductFormPage } from "./pages/admin/AdminProductFormPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminReviewsPage } from "./pages/admin/AdminReviewsPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutCancelPage } from "./pages/CheckoutCancelPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HomePage } from "./pages/HomePage";
import { LegalNoticePage, ShippingPage, TermsPage } from "./pages/LegalPages";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ShopPage } from "./pages/ShopPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "boutique", element: <ShopPage /> },
      { path: "produits/:slug", element: <ProductDetailPage /> },
      { path: "panier", element: <CartPage /> },
      { path: "commande", element: <CheckoutPage /> },
      { path: "commande/succes", element: <CheckoutSuccessPage /> },
      { path: "commande/annulee", element: <CheckoutCancelPage /> },
      { path: "connexion", element: <LoginPage /> },
      { path: "inscription", element: <RegisterPage /> },
      { path: "compte", element: <AccountPage /> },
      { path: "compte/favoris", element: <FavoritesPage /> },
      { path: "notre-histoire", element: <AboutPage /> },
      { path: "mentions-legales", element: <LegalNoticePage /> },
      { path: "cgv", element: <TermsPage /> },
      { path: "livraison-retours", element: <ShippingPage /> },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "produits", element: <AdminProductsPage /> },
          { path: "produits/:id", element: <AdminProductFormPage /> },
          { path: "commandes", element: <AdminOrdersPage /> },
          { path: "avis", element: <AdminReviewsPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
