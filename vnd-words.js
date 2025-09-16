/* Chuyển đổi số tiền thành chữ 1đ -> một đồng */

Object.defineProperty(String.prototype, "tovnwords", {
  value: function (prefix = "", suffix = "") {
    let num = +this.replace(/[.,\s]/g, "");
    if (!num) return prefix + "Không đồng" + suffix;

    const units = ["", "ngàn", "triệu", "tỷ"];
    const words = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

    const read3 = (n, forceHundred = false) => {
        let [h, t, u] = [~~(n/100), ~~((n%100)/10), n%10], r = "";
        if (h || forceHundred) r += words[h] + " trăm" + (t === 0 && u ? " linh" : "");
        if (t) r += " " + (t === 1 ? "mười" : words[t] + " mươi");
        if (u) r += " " + (
            t > 1 && [1,4,5].includes(u) ? (u === 1 ? "mốt" : u === 4 ? "tư" : "lăm") :
            (t === 1 && u === 5 ? "lăm" : words[u])
        );
        return r.trim();
    };


    let parts = [], groups = [], original = num;
    while (num > 0) { groups.unshift(num % 1000); num = ~~(num / 1000); }

    groups.forEach((g, idx) => g && parts.push(read3(g, g < 100 && idx > 0) + (units[groups.length - idx - 1] ? " " + units[groups.length - idx - 1] : "")));


    let result = parts.join(" ").replace(/\s+/g, " ").trim().replace(/^\w/, c => c.toUpperCase());

    result += (original % 1000 === 0 ? " đồng chẵn" : " đồng");
    return prefix + result + suffix;
  },
  writable: false,
  enumerable: false
});



// Ví dụ test:
console.log("0".tovnwords()); 
console.log("1".tovnwords()); 
console.log("4.521.000".tovnwords("(", "./.)"));     
// Bốn triệu năm trăm hai mươi mốt ngàn đồng chẵn

console.log("4,521,824,000".tovnwords()); 
console.log("45,154,244,000".tovnwords()); 
// Bốn tỷ năm trăm hai mươi mốt triệu tám trăm hai mươi tư ngàn đồng chẵn

console.log("4.251.120".tovnwords()); 
console.log("4.251.124".tovnwords()); 
console.log("1.101.000".tovnwords()); 
console.log("202.101.000".tovnwords()); 
console.log("1.020.850.000".tovnwords());
console.log("20.050.000".tovnwords()); 
