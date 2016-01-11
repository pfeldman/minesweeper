function Piece(number, mine, parent) {
    this.number = number;
    this.mine = mine;
    this.open = false;
    this.dom = undefined;

    this.render = function() {
        this.dom = $('<div class="piece"></div>');

        var instance = this;

        this.dom.bind("contextmenu", function() {
            instance.dom.toggleClass("flag");
            return false;
        });

        this.dom.click(function(){
            if(instance.hasMine())
            {
                parent.canWin = false;
                alert("You have lose");
                parent.showMines();
                return;
            }

            var nearMines = parent.searchMines(instance.number);
            if(nearMines > 0)
            {
                instance.dom.text(nearMines);
                instance.dom.addClass("mines" + nearMines);
            }
            instance.dom.addClass("opened");
            instance.show();
        });

        return this.dom;
    };

    this.show = function(){
        if(this.hasMine())
            this.dom.addClass("mine");

        this.open = true;
        parent.addOpened();
    };

    this.isOpen = function() {
        return this.open;
    };

    this.hasMine = function() {
        return this.mine;
    };
}

function Board(settings, parentDom) {
    this.mines = [];
    this.settings = settings;
    this.parentDom = parentDom;
    this.board = [];
    this.totalOpened = 0;
    this.canWin = true;

    this.addOpened = function() {
        this.totalOpened++;

        if(this.settings.width * this.settings.height - this.totalOpened - this.settings.mines === 0)
        {
            this.win();
        }
    };

    this.win = function() {
        if(this.canWin)
        {
            $(".overlay").show();
            $(".shareOn").fadeIn("slow");
            $(".shareOn label").click(function(){
                location.reload();
            });

            $(".shareOnFacebook").click(function(){
                var fbpopup = window.open("https://www.facebook.com/sharer/sharer.php?u=http://www.google.com", "pop", "width=600, height=400, scrollbars=no");
            });
        }
    };

    this.searchMines = function(number) {
        var mines = 0;
        var position = this.getPosition(number);

        if(this.board[position.x - 1] !== undefined)
            if(this.board[position.x - 1][position.y].hasMine())
                mines++;

        if(this.board[position.x + 1] !== undefined)
            if(this.board[position.x + 1][position.y].hasMine())
                mines++;

        if(this.board[position.x][position.y - 1] !== undefined)
            if(this.board[position.x][position.y - 1].hasMine())
                mines++;

        if(this.board[position.x][position.y + 1] !== undefined)
            if(this.board[position.x][position.y + 1].hasMine())
                mines++;

        if(this.board[position.x - 1] !== undefined && this.board[position.x - 1][position.y - 1] !== undefined)
            if(this.board[position.x - 1][position.y - 1].hasMine())
                mines++;

        if(this.board[position.x - 1] !== undefined && this.board[position.x - 1][position.y + 1] !== undefined)
            if(this.board[position.x - 1][position.y + 1].hasMine())
                mines++;

        if(this.board[position.x + 1] !== undefined && this.board[position.x + 1][position.y + 1] !== undefined)
            if(this.board[position.x + 1][position.y + 1].hasMine())
                mines++;

        if(this.board[position.x + 1] !== undefined && this.board[position.x + 1][position.y - 1] !== undefined)
            if(this.board[position.x + 1][position.y - 1].hasMine())
                mines++;

        return mines;
    };

    this.showMines = function() {
        for(var mine in this.mines)
        {
            var position = this.getPosition(this.mines[mine]);
            this.board[position.x][position.y].show();
        }
    };

    this.getPosition = function(position) {
        var y = Math.floor(position / this.settings.width);
        var x = Math.floor(parseFloat((position / this.settings.width) - y).toPrecision(12) * this.settings.width);

        return {'x' : x, 'y': y};
    };

    this.renderBoard = function() {
        var i;
        var boardArray = [];

        for(i = 0; i < this.settings.width * this.settings.height; i++)
        {
            boardArray.push(i + 1);
        }

        for(i=0; i < this.settings.mines; i++)
        {
            var random = boardArray[Math.floor(Math.random()*boardArray.length)];
            this.mines.push(random);
            boardArray.splice(random-1, 1);
        }

        var pieces = 0;
        var newLine = true;
        var appendToDom;
        for(i = 0; i < this.settings.width * this.settings.height; i++)
        {
            var lineCreated;
            if(newLine)
            {
                lineCreated = $('<div class="line"></div>');
                this.parentDom.append(lineCreated);
                newLine = false;
            }

            var haveMine = false;

            if(this.mines.indexOf(i) >= 0)
                haveMine = true;

            var piece = new Piece(i, haveMine, this);

            var position = this.getPosition(i);

            if(this.board[position.x] === undefined)
                this.board[position.x] = [];

            this.board[position.x].push(piece);

            lineCreated.append(piece.render());
            pieces++;

            if(pieces == this.settings.width)
            {
                pieces = 0;
                newLine = true;
            }
        }

        this.parentDom.css({
            'margin-left': this.settings.width * -25
        });
    };
}

$(function(){
    var board = new Board({
        width : 10,
        height : 10,
        mines : 10
    }, $(".minesweeperBoard"));

    board.renderBoard();
});
