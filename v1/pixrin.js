// Pixrin versi pertama, oleh Adi Nugraha Y

function PixRin(args, func)
{
    if(!(this instanceof PixRin)) {
        throw new Error("unable to run, require constructor with argument.");
    }
    
    var defaultArgs = {
        target : "body",
        
        canvasAuto : true,
        canvasW : 629,
        canvasH : 630,
        
        lengthX: 7,
        lengthY: 5,
        
        pixelW: 51,
        pixelH: 51,
        pixelGap:1,
        pixelColor: "#0A1C1F",
        pixelActiveColor: "#CFDF9F",
        pixelRenderer : null, // callback, see renderer_pixel()
        
        pixelLabelEnable: false,
        pixelLabelFont: "Consolas",
        pixelLabelColor: "#CFDF9F",
        pixelLabelSize: 9,
        pixelLabelActiveColor: "#0A1C1F",
        pixelLabelRenderer : null, // callback, see renderer_pixelLabel()
        
    };
    
    var args = Object.assign(defaultArgs, args);
    
    // context variable
    var canvas, ctx;
    
    // history activated pixels
    var history = [];
    
    // normal location, put 0,0 to the bottom left of the canvas
    var norm_x, norm_y;

    // binding dom
    canvas = document.querySelector(args.target);
    
    if (!canvas) {
        console.error("DOM target [" + args.target + "] not found");
        return;
    }
    // check dom is canvas, or create new one and append to current dom
    if (!canvas.getContext) {
		console.warn("Canvas not found, create it automatically.");
		
        var tmp = document.createElement("canvas");
		tmp.width = args.canvasW;
		tmp.height = args.canvasH;

		canvas.append(tmp);
        canvas = tmp;
	}
    
    // set context to the canvas above
	ctx = canvas.getContext("2d");

    // default callback for renderer pixel
    function renderer_pixel(context, coord, _args)
    {
        context.fillRect(coord.x,coord.y, _args.pixelW, _args.pixelH);
    }
    
    function renderer_pixelLabel(context, coord, label, _args)
    {
        context.font = _args.pixelLabelSize + "px " + _args.pixelLabelFont;
        context.fillStyle = _args.pixelLabelColor;
        context.fillText('(' + label.x + ',' + label.y + ')', 
                            coord.x, _args.pixelLabelSize + coord.y);
    }
    
    // canvas cleaning
    function canvasClear()
    {
        ctx.clearRect(0,0, args.canvasW, args.canvasH);
    }
    
    // check limit of pixel coordinate
    function coordOutOfLimit(x,y) 
    {
        if (x < 0 || x >= args.lengthX) {
            console.error("nilai X diluar batas");
            return true;
        }
        if (y < 0 || y >= args.lengthY) {
            console.error("nilai Y diluar batas");
            return true;
        }
        return false;
    }
    
    function noContext()
    {
        if (!ctx) {
            console.error("No Context Found");
            return true;
        } 
        return false;
    }
    
    // make 0,0 at bottom left corner
    function generateNormal()
    {
        norm_x = 0;
        norm_y = args.canvasH - args.pixelH - args.pixelGap;
    }
    
    // count canvas size by get total of boxes and gap
    function countCanvasSize()
    {
        args.canvasW = args.lengthX * (args.pixelW + args.pixelGap);
        args.canvasH = args.lengthY * (args.pixelH + args.pixelGap);
        
        canvas.width = args.canvasW - args.pixelGap;
        canvas.height = args.canvasH - args.pixelGap;
    }

    // plot individual pixel
    function plotPixel(x, y, color) 
    {
        // check limit
        if (noContext() || coordOutOfLimit(x,y)) return;
        
        // set color
        if (color)
            ctx.fillStyle = color;
        else
            ctx.fillStyle = args.pixelColor;
        
        // get actual pixel coordinate
        var cx = norm_x + x * (args.pixelW + args.pixelGap);
        var cy = norm_y - y * (args.pixelH + args.pixelGap);
        
        // callback (context, coordinate, arguments)
        if (typeof args.pixelRenderer == 'function') {
            args.pixelRenderer(ctx, {x:cx, y:cy}, args);
        }
        else {
            renderer_pixel(ctx, {x:cx, y:cy}, args);
        }
        
        if (args.pixelLabelEnable) {
            // callback (context, coordinate, labeling, arguments)
            if (typeof args.pixelLabelRenderer == 'function') {
                args.pixelLabelRenderer(ctx, {x:cx, y:cy}, {x:x, y:y}, args);
            }
            else {
                renderer_pixelLabel(ctx, {x:cx, y:cy}, {x:x, y:y}, args);
            }
        }
    }
    
    // plot line for helper
    function plotLine(x1,y1,x2,y2, color)
    {
        // check limit
        if (noContext() || coordOutOfLimit(x1,y1)
                        || coordOutOfLimit(x2,y2)) return;
        
        // set color
        if (color)
            ctx.strokeStyle = color;
        else
            ctx.strokeStyle = "#f00";
        
        // get center pixel
        var sqcw = Math.round(args.pixelW/2);
        var sqch = Math.round(args.pixelH/2);
        
        // get each endpoint of the line centered the pixel
        var cx1 = norm_x + x1 * (args.pixelW + square_gap) + sqcw;
        var cy1 = norm_y - y1 * (args.pixelH + square_gap) + sqch;
        var cx2 = norm_x + x2 * (args.pixelW + square_gap) + sqcw;
        var cy2 = norm_y - y2 * (args.pixelH + square_gap) + sqch;
        
        // draw line
        ctx.moveTo(cx1, cy1);   // atur titik awal ujung garis
        ctx.lineTo(cx2, cy2);   // atur titik akhir ujung garis
        ctx.stroke();           // gambar garis
        
        // reset, idk the effect, just set from line 182
        ctx.moveTo(0,0);        // reset titik awal ujung context
    }
    
    // populate pixels
    function createGridPixel()
    {
        // check limit
        if (noContext()) return;

        // clear canvas 
        canvasClear();
        
        for (var y = 0; y < args.lengthY; y++) {
        for (var x = 0; x < args.lengthX; x++) {
            plotPixel(x,y);
        } // end x
        } // end y
    }
    
    // mark given pixel`s coordinate
    function putPixel(x,y)
    {
        // check limit
        if (noContext() || coordOutOfLimit(x,y)) return false;
        
        // save original color
        var tmp1 = args.pixelColor;
        var tmp2 = args.pixelLabelColor;
        
        // set normal color to active state
        args.pixelColor = args.pixelActiveColor;
        args.pixelLabelColor = args.pixelLabelActiveColor;
        
        // mark pixel given by coordinate
        plotPixel(x,y);
        
        // restore normal color to original color
        args.pixelColor = tmp1;
        args.pixelLabelColor = tmp2;
        
        return true;
    }
    
    // clear all active pixels
    function clearHistory()
    {
        while(history.length > 0) {
            var tmp = history.pop();
            plotPixel(tmp.x, tmp.y);
        }
    }
    
    this.putPixel = function(x,y)
    {
        history.push({x:x,y:y});
        return putPixel(x,y);
    }
    
    this.clearPixel = function(x,y)
    {
        plotPixel(x,y);
    }
    
    this.clearPixelHistory = function()
    {
        clearHistory();
    }
    
    this.plotLine = function(x1,y1, x2,y2, color)
    {
        plotLine(x1,y1, x2,y2, color)
    }

    if (args.canvasAuto) {
        countCanvasSize();
    }
    
    generateNormal();
    createGridPixel();
}