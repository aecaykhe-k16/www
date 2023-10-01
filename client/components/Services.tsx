import Image from "next/image"
import { AiOutlineWifi } from "react-icons/ai"
import { CiBeerMugFull } from "react-icons/ci"
import { FaParking, FaSmoking, FaSwimmer } from "react-icons/fa"
import { IoIosFitness } from "react-icons/io"
import { IoFastFoodOutline } from "react-icons/io5"
import { MdOutlineLocalLaundryService } from "react-icons/md"
import { RiRestaurant2Line } from "react-icons/ri"
import SHOESHINE from "../assets/icon/Shoeshine.png"
import CONCIERGE from "../assets/icon/concierge.png"
import CAR from "../assets/icon/rentCar.png"
import SUMMER from "../assets/icon/summer.png"
import SUNNA from "../assets/icon/sunna.png"
// ha tầng
// sân thượng mùa hè /icon
// Internet Wi-Fi miễn phí trong toàn bộ khách sạn AiOutlineWifi
// phòng tập thể dục IoIosFitness
// tắm hơi /icon
// Bãi đậu xe FaParking
// Quán ba CiBeerMugFull
// phong hut thuoc FaSmoking
// Nhà hàng RiRestaurant2Line
// hồ bơi FaSwimmer

//dich vu
// Dịch vụ cho thuê xe /icon
// Dịch vụ trợ giúp đặc biệt /icon
// Dịch vụ giặt là và người giúp việc MdOutlineLocalLaundryService
// dịch vụ đánh giày /icon
// Dịch vụ ăn uống dịch vụ IoFastFoodOutline

export const listServices = [
  {
    id: "1",
    name: "Car rental",
    status: false,
    icon: <Image src={CAR} alt="" className="w-10 h-10" />
  },
  {
    id: "2",
    name: "Concierge",
    status: false,
    icon: <Image src={CONCIERGE} alt="" className="w-10 h-10" />
  },
  {
    id: "3",
    name: "Laundry and valet",
    status: false,
    icon: <MdOutlineLocalLaundryService className="text-3xl" />
  },
  {
    id: "4",
    name: "Shoeshine",
    status: false,
    icon: <Image src={SHOESHINE} alt="" className="w-10 h-10" />
  },
  {
    id: "5",
    name: "Catering",
    status: false,
    icon: <IoFastFoodOutline className="text-3xl" />
  }
]
export const listFacilities = [
  {
    id: "1",
    name: "Summer terrace",
    status: false,
    icon: <Image src={SUMMER} alt="" className="w-10 h-10" />
  },
  {
    id: "2",
    name: "Complimentary Wi-Fi internet",
    status: false,
    icon: <AiOutlineWifi className="text-3xl" />
  },
  {
    id: "3",
    name: "Fitness",
    status: false,
    icon: <IoIosFitness className="text-3xl" />
  },
  {
    id: "4",
    name: "Sunna",
    status: false,
    icon: <Image src={SUNNA} alt="" className="w-10 h-10" />
  },
  {
    id: "5",
    name: "Parking outside",
    status: false,
    icon: <FaParking className="text-3xl" />
  },
  {
    id: "6",
    name: "Bar",
    status: false,
    icon: <CiBeerMugFull className="text-3xl" />
  },
  {
    id: "7",
    name: "Smoking room",
    status: false,
    icon: <FaSmoking className="text-3xl" />
  },
  {
    id: "8",
    name: "Restaurant",
    status: false,
    icon: <RiRestaurant2Line className="text-3xl" />
  },
  {
    id: "9",
    name: "Swimming Pool",
    status: false,
    icon: <FaSwimmer className="text-3xl" />
  }
]
