const dataUrl = "https://unmaskz.github.io/bin-calendar-api/calendar.json";
const blueBinImage = await new Request("https://unmaskz.github.io/bin-calendar-api/blue-bin.png").loadImage();
const brownBinImage = await new Request("https://unmaskz.github.io/bin-calendar-api/brown-bin.png").loadImage();
const greenBinImage = await new Request("https://unmaskz.github.io/bin-calendar-api/green-bin.png").loadImage();
const greyBinImage = await new Request("https://unmaskz.github.io/bin-calendar-api/grey-bin.png").loadImage();


let widget = await createWidget();
Script.setWidget(widget);
widget.presentSmall();
Script.complete();

function getNextDayOfTheWeek(dayName, excludeToday = true, refDate = new Date()) {
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayName);
    if (dayOfWeek < 0) return;
    refDate.setHours(0, 0, 0, 0);
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

function getBinImage(bin) {
    if (bin === 'Brown') {
        return brownBinImage;
    } else if (bin === 'Green') {
        return greenBinImage;
    } else if (bin === 'Blue') {
        return blueBinImage;
    } else {
        return greyBinImage;
    }
}

async function createWidget() {
    const widget = new ListWidget();
    const nextCollectionDate = getNextDayOfTheWeek('Tuesday');
    const daysUntilNextCollection = dayDifference(new Date(), nextCollectionDate);

    const data = await new Request(dataUrl).loadJSON();
    const nextCollection = data.calendar.find(item => item.day === formatDate(nextCollectionDate));

    let heading = widget.addText("Bins Due in");
    heading.centerAlignText();
    heading.font = Font.lightSystemFont(18);
    heading.textColor = new Color("#ffffff");

    widget.addSpacer(5);

    let daysUntilText = widget.addText(`${daysUntilNextCollection} ${daysUntilNextCollection === 1 ? 'day' : 'days'}`);
    daysUntilText.centerAlignText();
    daysUntilText.font = Font.boldSystemFont(28);
    daysUntilText.textColor = new Color("#ffffff");

    widget.addSpacer(15);

    let bins = widget.addStack();
    bins.addSpacer();
    let binOne = bins.addImage(getBinImage(nextCollection.bins[0]));
    let binTwo = bins.addImage(getBinImage(nextCollection.bins[1]));
    binOne.imageSize = new Size(35, 35);
    binTwo.imageSize = new Size(35, 35);
    bins.addSpacer();

    /*
    let notification = new Notification();
    notification.title = "Bin Reminder";
    notification.body = `Your ${nextCollection.bins[0]} and ${nextCollection.bins[1]} are due tomorrow. Please put them out for collection.`;
    notification.setTriggerDate(getNextDayOfTheWeek('Monday'));
    await notification.schedule();
    */

    widget.backgroundGradient = new LinearGradient(['#00000022', '#00000022'], [0, 1]);
    return widget;
}