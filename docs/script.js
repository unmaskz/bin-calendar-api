const dataUrl = "https://unmaskz.github.io/bin-calendar-api/calendar.json";

let widget = await createWidget();
Script.setWidget(widget);
widget.presentMedium();
Script.complete();

function getNextDayOfTheWeek(dayName, excludeToday = true, refDate = new Date()) {
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayName);
    if (dayOfWeek < 0) return;
    refDate.setHours(0,0,0,0);
    refDate.setDate(refDate.getDate() + +!!excludeToday + (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
    return refDate;
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
  
function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
}

function dayDifference(today, nextCollectionDate) {
    const difference = nextCollectionDate.getTime() - today.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
}

function getIcon(bin) {
    if (bin === 'Brown') {
        return '🟤';
    } else if (bin === 'Green') {
        return '🟢';
    } else if (bin === 'Blue') {
        return '🔵';
    } else {
        return '⚫️';
    }
}

async function createWidget() {
    const widget = new ListWidget();
    const nextCollectionDate = getNextDayOfTheWeek('Tuesday');
    const daysUntilNextCollection = dayDifference(new Date(), nextCollectionDate);

    const data = await new Request(dataUrl).loadJSON();
    const nextCollection = data.calendar.find(item => item.day === formatDate(nextCollectionDate));

    let heading = widget.addText(`Next Collection: ${daysUntilNextCollection} days`);
    heading.centerAlignText();
    heading.font = Font.lightSystemFont(25);
    heading.textColor = new Color("#ffffff");

    widget.addSpacer(15);

    let binsText = `${getIcon(nextCollection.bins[0])} ${getIcon(nextCollection.bins[1])}`;
    let bins = widget.addText(binsText);
    bins.centerAlignText();

    widget.backgroundColor = new Color("#000000");
    return widget;
}