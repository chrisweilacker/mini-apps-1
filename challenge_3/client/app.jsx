class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    step: 0
    };

  }

  next(e) {
    if (this.state.step !== 5) {
      if (this.validateForm(this.state.step)) {
        this.postFormData(this.state.step);
        var newStep = this.state.step + 1;
        this.getFormData(newStep);
        }
    } else {
      $.get({url:'/restart'})
    }

  }


  prev(e) {
    if (this.state.step !== 0) {
      this.setState({
        step: this.state.step -= 1});
    }

  }

  validateForm(currentForm) {
    return true;
  }

  postFormData(newStep) {
    console.log('newStep: ', newStep);
    if (newStep === 1) {

    } else if (newStep === 2) {

    } else if (newStep === 3) {

    } else if (newStep === 4) {

    }

    this.setState({
      step: newStep});
  }

  getFormData(newStep) {
    console.log('newStep: ', newStep);
    if (newStep === 1) {

    } else if (newStep === 2) {

    } else if (newStep === 3) {

    } else if (newStep === 4) {

    }

    this.setState({
      step: newStep});
  }

  componentDidMount() {
    var myApp = this;
    $.ajax({
      url: '/step',
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        console.log('data and its type', data, typeof data);
        myApp.setState({
          step: data.step
        });
      }
    });
  }

  render() {
    if (this.state.step === 0) {
      return(
        <Home next={this.next.bind(this)} />
      );
    } else if (this.state.step === 1) {
      return(
        <UserForm prev={this.prev.bind(this)} next={this.next.bind(this)} />
      );
    } else if (this.state.step === 2) {
      return(
        <AddressForm prev={this.prev.bind(this)} next={this.next.bind(this)} />
      );
    } else if (this.state.step === 3) {
      return(
        <CardForm prev={this.prev.bind(this)} next={this.next.bind(this)} />
      );
    } else if (this.state.step === 4) {
      return(
        <Confirm prev={this.prev.bind(this)} next={this.next.bind(this)} />
      );
    } else if (this.state.step === 5) {
      return(
        <Confirmation/>
      );
    }
  }


}

var Home = (props) => {
  return (
  <div>
    <h1>Your Cart</h1>
    <br/> <br/>
    <p>Prank Gift Box</p>
    <img src='/GiftBox_.jpg'></img>
    <br/> <br/>
    <p>About this product</p>
    <p>PRANK GIFT BOXES at first appear to contain bizarre products from ridiculous companies. Simply pack the real gift inside, and try to keep a straight face as you watch your friends & loved ones attempt to remain gracious while thanking you for the “My First Fire”. Then watch them explode with laughter when they discover their actual gift inside and realize they’ve been pranked.
TAKE YOUR GIFT GIVING TO THE NEXT LEVEL WITH THE ORIGINAL GAG GIFT BOX.  We pride ourselves on our incredible attention to detail.   We’ve thought of everything from the ridiculous fictional product itself, to the hilarious images and detailed product description. This box will have any recipient truly convinced that you just gave them the most bizarre gift of all time!
ADD THE GIFT OF LAUGHTER to the party with this quirky and fun twist on the timeless tradition of gift giving. Whether you consider your gift giving skills to be amazing or not, wrapping any gift inside a Prank Pack adds an extra layer of fun and enjoyment that will have everyone in the room laughing.
HIGH QUALITY GIFT BOXES made in the USA of 100% recyclable cardboard.  Our boxes ship flat and are easy to assemble – no glue or extra steps required.  At 11.25” x 9” x 3.25” they are the perfect size for almost all gifts!
PLEASE NOTE. This is an EMPTY prank GIFT BOX.</p>
    <button onClick={props.next}>Checkout</button>
    </div> );
}

var UserForm = (props) => {
  return (
  <div>
    <h1>User Registration</h1>
    <br/> <br/>
    <form>
      <label>Name: </label><input type="text"></input><br/><br/>
      <label>Email: </label><input type="email"></input><br/><br/>
      <label>Password: </label><input type="password" id="pass" name="password"
           minLength="8"></input><br/><br/>
    <button onClick={props.prev}>Previous</button> <button onClick={props.next}>Next</button>
    </form>
    </div> );
}

var AddressForm = (props) => {
  return (
  <div>
    <h1>Shipping Address</h1>
    <br/> <br/>
    <form>
      <label>Address: </label><input type="text"></input><br/><br/>
      <label>Address 2: </label><input type="text"></input><br/><br/>
      <label>City: </label><input type="text"></input><label>State: </label><input type="text"></input><label>Zip: </label><input type="text"></input><br/><br/>
    <button onClick={props.prev}>Previous</button> <button onClick={props.next}>Next</button>
    </form>
    </div> );
}

var CardForm = (props) => {
  return (
  <div>
    <h1>Card Information</h1>
    <br/> <br/>
    <form>
      <label>Card#: </label><input type="text"></input><br/><br/>
      <label>Exp: </label><input type="text"></input>/<input type="text"></input><label>CCV: </label><input type="text"></input><label>Billing Zip: </label><input type="text"></input><br/><br/>
    <button onClick={props.prev}>Previous</button> <button onClick={props.next}>Next</button>
    </form>
    </div>);
}

var Confirm = (props) => {
  return (
  <div>
    <h1>Please Confirm Your Details</h1>
    <br/> <br/>
    <p>Prank Gift Box</p>
    <img src='GiftBox_.jpg'></img>
    <br/> <br/>
    <p>User Information</p>
    <label>Name: </label><br/><br/>
    <label>Email: </label><br/><br/>
    <p>Shipping Information</p>
    <label>Address: </label><br/><br/>
    <label>Address 2: </label><br/><br/>
    <label>City: </label><label>State: </label><label>Zip: </label><br/><br/>
    <p>Card Information</p>
    <label>Card#: </label><br/><br/>
    <label>Exp: </label><label>CCV: </label><label>Billing Zip: </label><br/><br/>
    <button onClick={props.prev}>Previous</button> <button onClick={props.next}>Confirm Purchase</button>
  </div> );
}

var Confirmation = (props) => {
  return (
  <div>
    <h1>Your Order of Prank Gift Box Has Been Placed</h1>
    <br/> <br/>
    <img src='GiftBox_.jpg'></img>
    <br/> <br/>
    <p>About this product</p>
    <p>PRANK GIFT BOXES at first appear to contain bizarre products from ridiculous companies. Simply pack the real gift inside, and try to keep a straight face as you watch your friends & loved ones attempt to remain gracious while thanking you for the “My First Fire”. Then watch them explode with laughter when they discover their actual gift inside and realize they’ve been pranked.
TAKE YOUR GIFT GIVING TO THE NEXT LEVEL WITH THE ORIGINAL GAG GIFT BOX.  We pride ourselves on our incredible attention to detail.   We’ve thought of everything from the ridiculous fictional product itself, to the hilarious images and detailed product description. This box will have any recipient truly convinced that you just gave them the most bizarre gift of all time!
ADD THE GIFT OF LAUGHTER to the party with this quirky and fun twist on the timeless tradition of gift giving. Whether you consider your gift giving skills to be amazing or not, wrapping any gift inside a Prank Pack adds an extra layer of fun and enjoyment that will have everyone in the room laughing.
HIGH QUALITY GIFT BOXES made in the USA of 100% recyclable cardboard.  Our boxes ship flat and are easy to assemble – no glue or extra steps required.  At 11.25” x 9” x 3.25” they are the perfect size for almost all gifts!
PLEASE NOTE. This is an EMPTY prank GIFT BOX.</p>
    <button onClick={props.next}>Reorder</button>
    </div> );
}



ReactDOM.render(<App/>, document.getElementById('Main'));