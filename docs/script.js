const dataUrl = "https://unmaskz.github.io/bin-calendar-api/calendar.json";

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

function getBinColour(bin) {
    if (bin === 'Brown') {
        return '#3a3434';
    } else if (bin === 'Green') {
        return '#48a03f';
    } else if (bin === 'Blue') {
        return '#419dc4';
    } else {
        return '#575556';
    }
}

function getNotificationDate(nextCollectionDate) {
    const nextCollectionDate = "";
}

async function createWidget() {
    const widget = new ListWidget();
    const nextCollectionDate = getNextDayOfTheWeek('Tuesday');
    const daysUntilNextCollection = dayDifference(new Date(), nextCollectionDate);

    const data = await new Request(dataUrl).loadJSON();
    const nextCollection = data.calendar.find(item => item.day === formatDate(nextCollectionDate));

    let heading = widget.addText("Bins Due In");
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
    let binIcon = SFSymbol.named('trash.fill')
    let binOne = bins.addImage(binIcon.image);
    let binTwo = bins.addImage(binIcon.image);
    binOne.tintColor = new Color(getBinColour(nextCollection.bins[0]));
    binTwo.tintColor = new Color(getBinColour(nextCollection.bins[1]));
    binOne.imageSize = new Size(35, 35);
    binTwo.imageSize = new Size(35, 35);
    bins.addSpacer();

    
    let notification = new Notification();
    notification.title = "Bin Reminder";
    notification.body = `Your ${nextCollection.bins[0]} and ${nextCollection.bins[1]} are due tomorrow. Please put them out for collection.`;
    const triggerDate = getNotificationDate(nextCollectionDate);
    //notification.setTriggerDate(triggerDate);
    //await notification.schedule();

    let startColor = new Color("#4b5735");
    let endColor = new Color("#3d6032");
    let gradient = new LinearGradient();
    gradient.colors = [startColor, endColor];
    gradient.locations = [0.0, 1];
    widget.backgroundGradient = gradient;
    return widget;
}