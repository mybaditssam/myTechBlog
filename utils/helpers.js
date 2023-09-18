function formatDate(date) {
    const formattedDate = new Date(date);

    if (isNaN(formattedDate)) {
        return 'Invalid Date';
    }

    const month = formattedDate.getMonth() + 1;
    const day = formattedDate.getDate();
    const year = formattedDate.getFullYear();

    return `${month}/${day}/${year}`;
}

module.exports = {
    formatDate
};
