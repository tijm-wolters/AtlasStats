// Imports
import PVObject from "PersistentData";
import { Setting, SettingsObject } from "SettingsManager/SettingsManager";


// Settings menu
const settings = new SettingsObject("AtlasStats", [{
        name: "Display Settings",
		settings:[
            new Setting.Toggle("Enable hud", true),
            new Setting.Toggle("Ban rate", true),
            new Setting.Toggle("Ban accuracy", true),
            new Setting.Slider("Decimals", 1, 1, 5, 0),
            new Setting.Slider("Text location X", 10, 0, Renderer.screen.getWidth(), 0),
            new Setting.Slider("Text location Y", 10, 0, Renderer.screen.getHeight(), 0)
		],
	},
]).setCommand('ats').setSize(300, 125);
Setting.register(settings);


// Persistant data for statistics carry-over
var olddata = new PVObject("AtlasStats", {
    verdict: 0,
    ban: 0
});

var data = new PVObject("AtlasStats", {
    verdict: olddata.verdict,
    ban: olddata.ban,
    hack: olddata.ban,
    legit: 0
}, ".newdata.json")




// Keybinds
const TPsus = new KeyBind("Teleport to suspect", Keyboard.KEY_NONE, "AtlasStats")

register("tick", function(){
    if(TPsus.isPressed()){
        ChatLib.command("tp suspect")
    }
});


// Registration for verdicts and bans
register("chat", function(message, event){
    data.verdict++;
}).setCriteria("&r&aAtlas verdict submitted! Thank you :)&r");

register("chat", function(message, event){
    data.ban++;
}).setCriteria("&8+&r&32,000 &r&7Hypixel Experience (Positive Atlas Verdict)&r");


// Rendering of the text
register("renderOverlay", myRenderOverlay);
function myRenderOverlay() {
    if (settings.getSetting("Display Settings", "Enable hud")) {

        // Variables for location and rates / accuracy
        let x = Number(settings.getSetting("Display Settings", "Text location X"));
        let y = Number(settings.getSetting("Display Settings", "Text location Y"));
        let banRate = ((data.ban / data.verdict) * 100).toFixed(settings.getSetting("Display Settings", "Decimals"));
        let banAccuracy = ((data.ban / data.hack) * 100).toFixed(settings.getSetting("Display Settings", "Decimals"));
        var dist;
        
        // Use of Text function
        let title = new Text("Statistics for Hypixel Atlas", x, y).setColor(Renderer.GOLD);
        let verdictRender = new Text("Verdicts: " + data.verdict, x, y + 10);
        let banRender = new Text("Bans: " + data.ban, x, y + 20);

        // Drawing the text functions on screen
        title.draw();
        verdictRender.draw();
        banRender.draw();


        // Takes the percentage of bans
        if (settings.getSetting("Display Settings", "Ban rate")) {
            let banPercent = new Text(
                "Ban rate: " + banRate + "%", x, y + 30);
                dist = 40;
            banPercent.draw();
        }

        else {
            dist = 30;
        }


        // Takes the ban accuracy
        if (settings.getSetting("Display Settings", "Ban accuracy")) {
            let banAPercent = new Text(
                "Ban accuracy: " + banAccuracy + "%", x, y + dist);

                banAPercent.draw();
        }
    }
}


// Gui check for Positive or negative verdicts
var guiClickTrigger = register("GuiMouseClick", clickFunction);

function clickFunction(mouseX, mouseY, mouseButton, guiName, event) {
    try {

        // Gets clicked gui slot
        var inventory = Player.getOpenedInventory();
        var inventoryName = inventory.getName();

        var myGui = Client.currentGui.get();
        var slotHash = myGui.getSlotUnderMouse();

        if (slotHash !== null) {
            var slotInt = slotHash.field_75222_d;
            ChatLib.chat(slotInt);
        }

        // Adds to hack or legit variable if Verdict is made
        if (inventoryName == "Atlas Verdict - Hacking") {
            if (slotInt == 32) {
                setTimeout(function(){
                    data.hack++;
                }, 3000);
            }
            else if (slotInt == 30) {
                setTimeout(function(){
                    data.legit++;
                }, 3000);
            }
            else {
                return;
            }
        }
    }
    catch(e) {
        return;
    }
    
}