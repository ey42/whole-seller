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