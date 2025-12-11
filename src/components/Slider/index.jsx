import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'

import React from 'react'

import 'swiper/css'
import 'swiper/css/pagination'

export const Slider = ({ children, slidesPerView = 1, spaceBetween = 0 }) => {
    return (
        <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            slidesPerView={slidesPerView}
            spaceBetween={spaceBetween}
        // onSlideChange={() =>}
        // onSwiper={(swiper)}
        >
            {React.Children.map(children, (child) => {
                return <SwiperSlide>{child}</SwiperSlide>
            })}
        </Swiper>
    )
}
