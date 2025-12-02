/**
 * 使用 DiceBear API 產生像素風格頭像 URL
 */
const DICEBEAR_STYLES = ['pixel-art', 'avataaars', 'bottts'];
const DEFAULT_STYLE = 'pixel-art';

/**
 * 預先產生 100 個不同的頭像 URL
 */
export function generateBossAvatars(count = 100) {
    const avatars = [];
    const style = DEFAULT_STYLE;

    for (let i = 0; i < count; i++) {
        const seed = `boss-${i}-${Date.now()}`;
        const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&size=200`;
        avatars.push({
            id: i,
            url,
            name: `關主 ${i + 1}`,
        });
    }

    return avatars;
}

/**
 * 從頭像列表中隨機選取一個
 */
export function getRandomBoss(avatars) {
    const randomIndex = Math.floor(Math.random() * avatars.length);
    return avatars[randomIndex];
}
