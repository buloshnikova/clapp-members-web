export class Coupon {
    constructor(
        public _id: string,
        public business_id: string,
        public business_title: string,
        public title: string,
        public barcode_img: string,
        public coupon_type: string,
        public description?: string,
        public exp_date?: any,
        public start_date?: any,
        public img_type?: string,
        public logo?: string,
        public categories?: string[],
        public locations?: string[]) {

    }
}