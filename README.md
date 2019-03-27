# Pixrin

Menggunakan objek untuk mempresentasikan pixel pada Javascript. Pixrin menggunakan canvas sebagai media penggambaran.

### Cara Memakai? 

#### Sertakan Pustaka
```html
<script type="text/javascript" src="pixrin.js"></script>
```
#### Kaitkan Objek
```javascript
var pixrin = new PixRin({
        // setelan
        target: "body",
    });
```

### Setelan

| Nama               | Setelan Awal | Keterangan                                        |
| --------------------- | :-----------: | ------------------------------------------------------------ |
| `target`              |    `"body"`   | Target merupakan **canvas** atau **pembungkus** canvas, dalam arti tempat untuk meletakkan elemen canvas. |
| `lengthX`             |       `7`       | Banyak kotak yang digambarkan terhadap sumbu X               |
| `lengthY`             |       `5`       | Banyak kotak yang digambarkan terhadap sumbu Y               |
| `canvasW`             |      `629`      | lebar canvas pada setelan.                                   |
| `canvasH`             |      `630`      | tinggi canvas pada setelan.                                  |
| `canvasAuto`          |     `true`    | Menghitung ukuran canvas berdasarkan ukuran, banyak, dan gap (jeda antar pixel). Jika diaktifkan, setelan ini akan mengabaikan `canvasW` dan `canvasH`. |
|                       |               |                                                              |
| **Pixel**     |               |                                                              |
| `pixelW`              |      `51`     | Lebar pixel                                                  |
| `pixelH`              |      `51`     | Tinggi pixel                                                 |
| `pixelGap`            |       `1`       | Pemisah antar pixel                                          |
| `pixelColor`          |   `"#0A1C1F"`   | Warna pixel normal dalam representasi tidak aktif            |
| `pixelActiveColor`    |   `"#CFDF9F"`   | Warna pixel aktif                                            |
| `pixelRenderer`       |     `null`    | Setelan fungsi callback untuk proses penciptaan sebuah pixel. Jika diisi akan meniban (override) fungsi bawaannya. <br />*Lihat bagian Callback untuk lebih lanjut.*|
|                       |               |                                                              |
| **Pixel Label** |               |                                                              |
| `pixelLabelEnable`    |     `false`     | Aktifkan label berupa koordinat sebuah pixel.                |
| `pixelLabelFont`      |  `"Consolas"` | Jenis font untuk penulisan label.                            |
| `PixelLabelSize`      |       `9`       | Ukuran label                                                 |
| `pixelLabelColor`     |   `"#CFDF9F"`   | Warna tulisan pixel normal dalam representasi tidak aktif    |
| `pixelLabelActiveColor` |   `"#0A1C1F"`   | Warna tulisan pixel aktif                                    |
| `pixelLabelRenderer`  |     `null`    | Cara penggambaran label sebuah pixel. Jika diisi, maka akan meniban (override) fungsi bawaannya. <br />*Lihat bagian Callback untuk lebih lanjut.* |
|                       |               |                                                              |
#### Callback Bawaan
##### pixelRenderer
```javascript
pixelRenderer: function (context, coord, options)
{
    context.fillRect(coord.x,coord.y, options.pixelW, options.pixelH);
}
```

##### pixelLabelRenderer
```javascript
pixelLabelRenderer: function (context, coord, label, options)
{
    context.font = _args.pixelLabelSize + "px " + options.pixelLabelFont;
    context.fillStyle = options.pixelLabelColor;
    context.fillText('(' + label.x + ',' + label.y + ')', 
                      coord.x, options.pixelLabelSize + coord.y);
}
```

### Method

Pixrin saat ini hanya memiliki sedikit method, diantaranya:

###### pixrin.putPixel(`x`, `y`);

Mengaktifkan pixel pada posisi x, y. 

###### pixrin.clearPixel(`x`,  `y`);

Menonaktifkan pixel pada posisi x, y.

###### pixrin.clearPixelHistory();

Menonaktifkan semua pixel yang sedang aktif.

