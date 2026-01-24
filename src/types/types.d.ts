import { user } from './../files/fakedatabase';
interface pageProps {
    params: {
        [key: string] : string
    }
}
export interface formDataProp {
  fullName: string,
  image: File | null ,
  email: string,
  phoneNumber: string,
  password1: string,
  password2: string,
  shopName: string,
  subCity: string,
  woreda: string,
  kebele: string,
  tinNumber: string
}
interface oneCategory {
    catagory: string;
    products: {
        name: string;
        price: number;
        amountOnStock: number;
        description: string;
        image: string;
        id: string;
    }[];
    description: string;
    details: string;
    image: string;
    id: string;
}
interface productProps {
        name: string;
        price: number;
        amountOnStock: number;
        description: string;
        image: string;
        id: string;
}[]

interface userProps {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    userRole: "user" | "admin" | "intermediate"
}

interface profileProps {
    id: string;
    userId: string;
    woreda: string | null;
    kebele: string | null;
    subCity: string;
    shopName: string | null;
    TIN: string | null;
    phoneNumber: string;
    image: string | null;
}

interface userProfileProps{
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    userRole: "user" | "admin" | "intermediate"
    profile: profileProps;
}

interface userNotificationProps {
    id: string;
    view: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    adminId: string;
    message: string;
    user: userProps;
}
interface notificationProps{
    id: string;
    view: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    message: string;
}
interface messageProps {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    image: string | null;
    message: string;
    view: boolean | null;
}
interface userMessageProps {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    image: string | null;
    message: string;
    view: boolean | null;
    user: userProps
}
interface userSessionProps {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    token: string;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string;
    user: userProps
}
interface sessionProps {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    token: string;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string;
}
interface categoryProp {
    id: string;
    name: string;
    createdAt: Date;
    userId: string | null;
    image: string;
    description: string;
    updateAt: Date;
}
interface categoryWithProductProps {
    id: string;
    name: string;
    createdAt: Date;
    userId: string | null;
    image: string;
    description: string;
    updateAt: Date;
    products: productProp[]
}
interface productProp {
        id: string;
        name: string;
        createdAt: Date;
        userId: string;
        image: string;
        description: string;
        updateAt: Date;
        price: string ;
        categoryId: string | null;
        stockOuantity: number ;
        like: number | null;
        type: string
    };
interface userProductProp {
        id: string;
        name: string;
        createdAt: Date;
        userId: string;
        image: string;
        description: string;
        updateAt: Date;
        price: string ;
        categoryId: string | null;
        stockOuantity: number ;
        like: number | null;
        type: string
        user: userProps
    };

