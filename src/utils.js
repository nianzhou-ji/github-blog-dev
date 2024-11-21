class Utils {
    static encodeBase64Modern=(input)=> {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(input);
        return btoa(String.fromCharCode(...uint8Array));
    }

    static decodeBase64Modern=(encoded)=> {
        const binary = atob(encoded);
        const uint8Array = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
        const decoder = new TextDecoder();
        return decoder.decode(uint8Array);
    }



    static  numberToHeaderTag=(num)=> {
        if (num >= 1 && num <= 5) {
            return 'h' + num;
        } else {
            throw new Error("Number must be between 1 and 5");
        }
    }
}

export default Utils
