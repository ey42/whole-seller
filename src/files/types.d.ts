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

interface userPros {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface profileProps {
    id: string;
    userId: string;
    woreda: string | null;
    kebele: string | null;
    userRole: "user" | "admin" | "intermediate" | null;
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
    profile: profileProps;
}