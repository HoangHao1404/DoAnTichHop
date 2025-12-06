const otpStore = new Map();

class OtpService {
    generateOtp(phone){
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expireAt = Date.now() + 5 * 60 * 1000; //5 phút
        otpStore.set(phone, {code, expireAt});
        return code;
    }

    veryfyOtp(phone, code){
        const record = otpStore.get(phone);
        if(!record) return false;

        if(record.expireAt < Date.now()){
            otpStore.delete(phone);
            return false;
        }

        if(record.code !== code) return false;

        otpStore.delete(phone);
        return true;
    }
}

module.export = new OtpService();