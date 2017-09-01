
exports.jenkinsHash = function(msg) {
    var h = lookup3(msg);
    return (h.c).toString(16);
    function lookup3(k) {
        var length = k.length;
        var a, b, c;

        a = b = c = 0xdeadbeef + length + 0;
        c += 0;

        var offset = 0;
        while (length > 12) {
            a += k[offset + 0];
            a += k[offset + 1] << 8;
            a += k[offset + 2] << 16;
            a += k[offset + 3] << 24;

            b += k[offset + 4];
            b += k[offset + 5] << 8;
            b += k[offset + 6] << 16;
            b += k[offset + 7] << 24;

            c += k[offset + 8];
            c += k[offset + 9] << 8;
            c += k[offset + 10] << 16;
            c += k[offset + 11] << 24;

            mixed = mix(a, b, c);
            a = mixed.a;
            b = mixed.b;
            c = mixed.c;

            length -= 12;
            offset += 12;
        }

        switch (length) {
            case 12: c += k[offset + 11] << 24;
            case 11: c += k[offset + 10] << 16;
            case 10: c += k[offset + 9] << 8;
            case 9: c += k[offset + 8];

            case 8: b += k[offset + 7] << 24;
            case 7: b += k[offset + 6] << 16;
            case 6: b += k[offset + 5] << 8;
            case 5: b += k[offset + 4];

            case 4: a += k[offset + 3] << 24;
            case 3: a += k[offset + 2] << 16;
            case 2: a += k[offset + 1] << 8;
            case 1: a += k[offset + 0]; break;

            case 0: return {c: c >>> 0, b: b >>> 0};
        }

        mixed = finalMix(a, b, c)
        a = mixed.a;
        b = mixed.b;
        c = mixed.c;

        return {c: c >>> 0, b: b >>> 0};
    }

    function mix(a, b, c) {
        a -= c; a ^= rot(c, 4); c += b; 
        b -= a; b ^= rot(a, 6); a += c;
        c -= b; c ^= rot(b, 8); b += a;
        a -= c; a ^= rot(c, 16); c += b;
        b -= a; b ^= rot(a, 19); a += c;
        c -= b; c ^= rot(b, 4); b += a;
        return {a : a, b : b, c: c};
    }

    function finalMix(a, b, c) {
        c ^= b; c -= rot(b, 14);
        a ^= c; a -= rot(c, 11);
        b ^= a; b -= rot(a, 25);
        c ^= b; c -= rot(b, 16);
        a ^= c; a -= rot(c, 4);
        b ^= a; b -= rot(a, 14);
        c ^= b; c -= rot(b, 24);
        return {a : a, b : b, c: c};
    }

    function rot(x, k) {
        return (((x) << (k)) | ((x) >> (32-(k))));
    }
};

