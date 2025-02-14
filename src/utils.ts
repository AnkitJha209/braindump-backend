export const randomHash = (len: number) => {
    let string = '1234567890qwertyuiopasdfghjklzxcvbnm'
    let length = string.length
    let ans = ''
    for (let i = 0;  i< len; i++) {
        ans += string[Math.floor(Math.random() * length)]  
    }
    return ans
}