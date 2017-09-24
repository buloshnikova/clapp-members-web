export class Coupon {
    constructor(
        public _id?: string,
        public business_id?: string,
        public business_title?: string,
        public title?: string,
        public barcode_img?: string,
        public coupon_type?: any,
        public description?: string,
        public exp_date?: any,
        public start_date?: any,
        public img_type?: any,
        public logo?: string,
        public categories?: any[],
        public locations?: any[]) {

    }
}