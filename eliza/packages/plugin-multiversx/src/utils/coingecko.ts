export const fetchPrices = async (coins: string[]) => {
    const coinsString = coins.join('%2C')

    const data = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinsString}&vs_currencies=usd`);

    const response = await data.json();

    return response;
}