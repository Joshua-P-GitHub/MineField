Project Name: Minefield

Description: You are a player which has to transverse from one end of the minefield to the other without losing all your lives. You will roll a dice which will determine how far you will go. Along your way you can buy upgrades to make your life easier

languages Used:
Javascript
CSS
HTML


Player - This class was created to keep track of the player points, coins, and health. i also use this class to move the player from one point to another
  -Health - player health
  -points - player points
  -game - i had used this to reference the game the player was in. this was not needed but i just started tyiping and i opened my eyes and it was there so i ran with it
  -luck - this is the player luck and you can buy upgrades to incease your luck. It will be a higher chance that you will get the number you want
    -CheckIfLucky() this function is to see if the player will get the number he wants or not. Math.random is used and if that number is higher than the player luck then the number will be rndomly generated but if it is lowert then it will be the number he wants
      -isLucky - this is the variable used to determine whether or not to use a random number or the player number
  Move() this funtion is used to move the player across the virtual map

  Gamecontroller - This class was created control what happens when
    map- This is the virtual map created so i can keep track in javascript what property a square has and where it is at
    playerCurrentPosition - keeps track where the player is on the virtual map
    Player - creates a new player 
    mines - keep track of how much mines is left
    gridcount - keeps count of howmany minefields you completed
    normal -is refering to the normal rate in which points is increased by
  
  Squares - This class was created to represent every sqaure that will be on the feild 
    itisamine - to know if the square is a mine or not
    itisrevealed - to know if it is revealed as a mine or a safe block
    squareplacement - to know where the square is in reference to the virtual map
    Reveal() - this function is used to reveal if its a mine or not
    squareid - to beable to reference the html aspect of it
  
  Gamecontroller:
  createMinemap() this function creates a random virtual map with mines put at random
    rowint is used to keep track of the rows
    using a for of loop to cylce through each row
      In each row i loop seven times putting a square in its row
    Then i increase the row and start from the beggining until each row has seven squares
    Next i do a loop again through each row so i set row int back to 1
      i created a array to represent the seven spots in each row
      i check and see if its the first row then i will remove spot 1 cause i dont want a mine on the last square
      then i check if it is the last row and i remove the last spot cause that is where the player will start and i so not want a mine where the player start
      then i loop 2 times cause i want only two mines per row
      i choose a random number between 0 and 6 cause i want this random number to be and index
      then i set spot number equal to the number in that index spot
      then i grap that specific square from the map and make it a mine
      then i remove that number from that index
      then i increase the row and loop again
      then i set the player current sqaure to the end of the grid
  CreateDomSquares() - this function was used to actually put the squares on the screen
  i loop 49 times cause i want 49 squares
    i create a new div
    i set the html id equal to the square id in my javascript
    i set the class to square to add all the css
    then i await sleep which cause you to be able to see the actual squares be placed
  
unsoled problems:
square not lighting up mine when passed over it
  
