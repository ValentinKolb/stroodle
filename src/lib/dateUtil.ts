export function formateChatDate(date: Date): string {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = diffInMilliseconds / (1000 * 60);
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    // Less than 1 hour ago (display in minutes)
    if (diffInMinutes < 60) {
        const t = Math.round(diffInMinutes)
        if (t === 0) {
            return `gerade eben`;
        }
        return `vor ${t} Minuten`;
    }

    // Less than 24 hours ago
    if (diffInHours < 24) {
        return `vor ${Math.round(diffInHours)} Stunden`;
    }

    // Less than 7 days ago
    if (diffInHours < 168) { // 24 * 7 = 168
        const daysAgo = Math.round(diffInHours / 24);
        return `vor ${daysAgo} Tagen`;
    }

    // More than 7 days ago
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based in JS
    const year = date.getFullYear();

    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
}

export function formatTaskDate(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part to compare only dates

    const diffInMilliseconds = date.getTime() - today.getTime();
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    const weeks = Math.floor(diffInDays / 7);
    const months = Math.floor(diffInDays / 30); // Assuming average month length for simplicity

    if (diffInDays === 0) {
        return "heute";
    } else if (diffInDays > 0) {
        if (months > 0) {
            return `in ${months} Monat(en)`;
        } else if (weeks > 0) {
            return `in ${weeks} Woche(n)`;
        } else {
            return `in ${diffInDays} Tag(en)`;
        }
    } else {
        const absDiffInDays = Math.abs(diffInDays);
        if (months < 0) {
            return `vor ${Math.abs(months)} Monat(en)`;
        } else if (weeks < 0) {
            return `vor ${Math.abs(weeks)} Woche(n)`;
        } else {
            return `vor ${absDiffInDays} Tag(en)`;
        }
    }
}