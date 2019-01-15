class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    step: 0,
    name: '',
    email: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    zip: '',
    phone_number: '',
    creditcard: '',
    expiry: '',
    cvv: '',
    billingzip: ''
    };

  }

  next(e) {
    if (this.state.step !== 5) {
      if (this.validateForm(this.state.step)) {
        var myApp = this;
        this.postFormData(this.state.step, function (){
          var newStep = myApp.state.step + 1;
          myApp.getFormData(newStep);
        });
        }
    } else {
      $.get({url:'/restart'});
    }

  }


  prev(e) {
    if (this.state.step > 1) {
      var newStep = this.state.step - 1;
      this.getFormData(newStep);
    }

  }

  validateForm(currentForm) {

    if (currentForm === 1) {
      //test for validation return false if not valid
    }
    return true;
  }

  postFormData(step, cb) {
    var myApp = this;
    if (step === 1) {
      $.ajax({
        url: '/user',
        method: 'POST',
        xhrFields: {withCredentials: true},
        dataType: 'json',
        data: {
          name: $('#name').val(),
          email: $('#email').val(),
          password: $('#pass').val()
        },
        success: function (data) {
          console.log('posted User Form Data');
          cb();
        }
      });
    } else if (step === 2) {
      var dataToSend = {
        address_1: $('#address_1').val(),
        address_2: $('#address_2').val(),
        city: $('#city').val(),
        state: $('#state').val(),
        zip:  $('#zip').val(),
        phone: $('#phone_number').val(),
      }
      console.log(dataToSend);
      $.ajax({
        url: '/address',
        method: 'POST',
        xhrFields: {withCredentials: true},
        dataType: 'json',
        data: dataToSend,
        success: function (data) {
          console.log('posted address Form Data');
          cb();
        }
      });
    } else if (step === 3) {
      $.ajax({
        url: '/card',
        method: 'POST',
        xhrFields: {withCredentials: true},
        dataType: 'json',
        data: {
          creditcard: $('#creditcard').val(),
          expiry: $('#expirymonth').val() + '/' + $('#expiryyear').val(),
          cvv:  $('#cvv').val(),
          billingzip: $('#billingzip').val()
        },
        success: function (data) {
          console.log('posted Card Form Data', data, typeof data);
          cb();
        }
      });
    } else if (step === 4) {
      $.ajax({
        url: '/purchased',
        method: 'POST',
        xhrFields: {withCredentials: true},
        dataType: 'json',
        data: {
          purchased: true
        },
        success: function (data) {
          console.log('posted Confirm Form Data', data, typeof data);
          cb();
        }
      });
    } else {
      cb();
    }
  }

  getFormData(newStep) {
    var myApp = this;
    if (newStep === 1) {
      $.ajax({
        url: '/user',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
          console.log('data and its type', data, typeof data);
          myApp.setState({
            name: data.name,
            step: newStep,
            email: data.email
          });
        }
      });
    } else if (newStep === 2) {
      $.ajax({
        url: '/address',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
          console.log('data and its type', data, typeof data);
          myApp.setState({
            step: newStep,
            address_1: data.address_1,
            address_2: data.address_2,
            city: data.city,
            state: data.state,
            zip: data.zip,
            phone_number: data.phone
          });
        }
      });
    } else if (newStep === 3) {
      $.ajax({
        url: '/card',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
          console.log('data and its type', data, typeof data);
          myApp.setState({
            step: newStep,
            creditcard: data.creditcard,
            expiry: data.expiry,
            cvv: data.cvv,
            billingzip: data.billingzip
          });
        }
      });
    } else if (newStep === 4) {
      $.ajax({
        url: '/confirm',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
          console.log('data and its type', data, typeof data);
          myApp.setState({
            name: data.name,
            step: newStep,
            email: data.email,
            address_1: data.address_1,
            address_2: data.address_2,
            city: data.city,
            state: data.state,
            zip: data.zip,
            phone_number: data.phone_number,
            creditcard: data.creditcard,
            expiry: data.expiry,
            cvv: data.cvv,
            billingzip: data.billingzip
          });
        }
      });
    } else if (newStep === 5) {
      myApp.setState({
        step: newStep
      });
    }
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
        <UserForm next={this.next.bind(this)} name={this.state.name} email={this.state.email}/>
      );
    } else if (this.state.step === 2) {
      return(
        <AddressForm prev={this.prev.bind(this)} next={this.next.bind(this)} address_1={this.state.address_1} address_2={this.state.address_2}
        city = {this.state.city} state={this.state.state} zip={this.state.zip} phone_number={this.state.phone_number}/>
      );
    } else if (this.state.step === 3) {
      return(
        <CardForm prev={this.prev.bind(this)} next={this.next.bind(this)}
         creditcard={this.state.creditcard} expiry={this.state.expiry} cvv={this.state.cvv} billingzip={this.state.billingzip}/>
      );
    } else if (this.state.step === 4) {
      return(
        <Confirm prev={this.prev.bind(this)} next={this.next.bind(this)} name={this.state.name} email={this.state.email}
        address_1={this.state.address_1} address_2={this.state.address_2} city = {this.state.city} state={this.state.state} zip={this.state.zip}
        phone_number={this.state.phone_number} creditcard={this.state.creditcard} expire={this.state.expiry} cvv={this.state.cvv} billingzip={this.state.billingzip}/>
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
  <div className="container-fluid">
    <h1>Your Cart</h1>
    <br/> <br/>
    <h2>Prank Gift Box</h2>
    <img src='/GiftBox_.jpg'></img>
    <br/> <br/>
    <p>About this product</p>
    <p>PRANK GIFT BOXES at first appear to contain bizarre products from ridiculous companies. Simply pack the real gift inside, and try to keep a straight face as you watch your friends & loved ones attempt to remain gracious while thanking you for the “My First Fire”. Then watch them explode with laughter when they discover their actual gift inside and realize they’ve been pranked.
<br/><br/>TAKE YOUR GIFT GIVING TO THE NEXT LEVEL WITH THE ORIGINAL GAG GIFT BOX.  We pride ourselves on our incredible attention to detail.   We’ve thought of everything from the ridiculous fictional product itself, to the hilarious images and detailed product description. This box will have any recipient truly convinced that you just gave them the most bizarre gift of all time!
<br/><br/>ADD THE GIFT OF LAUGHTER to the party with this quirky and fun twist on the timeless tradition of gift giving. Whether you consider your gift giving skills to be amazing or not, wrapping any gift inside a Prank Pack adds an extra layer of fun and enjoyment that will have everyone in the room laughing.
<br/><br/>HIGH QUALITY GIFT BOXES made in the USA of 100% recyclable cardboard.  Our boxes ship flat and are easy to assemble – no glue or extra steps required.  At 11.25” x 9” x 3.25” they are the perfect size for almost all gifts!
PLEASE NOTE. This is an EMPTY prank GIFT BOX.</p>
    <button style={{float: 'right'}} className="btn btn-primary" onClick={props.next}> Checkout </button>
    </div> );
};

var UserForm = (props) => {
  return (
  <div className="container-fluid">
    <h1>User Registration</h1>
    <br/> <br/>
      <label>Name:&emsp;</label><input type="text" id='name' defaultValue={props.name}></input><br/><br/>
      <label>Email:&emsp;</label><input type="email" id='email' defaultValue={props.email}></input><br/><br/>
      <label>Password:&emsp;</label><input type="password" id="pass"
           minLength="8"></input><br/><br/>
     <button className="btn btn-primary" onClick={props.next}>Next</button>
    </div> );
};

var AddressForm = (props) => {
  return (
  <div className="container-fluid">
    <h1>Shipping Address</h1>
    <br/> <br/>
      <label>Address:&emsp;</label> <input type="text" id="address_1" defaultValue={props.address_1}></input><br/><br/>
      <label>Address 2:&emsp;</label> <input type="text" id="address_2" defaultValue={props.address_2}></input><br/><br/>
      <label>City:&emsp;</label> <input type="text" id="city" defaultValue={props.city}></input><label>&emsp;State:&emsp;</label><input type="text" id="state" defaultValue={props.state}></input><label>&emsp;Zip:&emsp;</label><input type="text" id="zip" defaultValue={props.zip}></input><br/><br/>
      <label>Phone:&emsp;</label> <input type="text" id="phone_number" defaultValue={props.phone_number}></input><br/><br/>
    <button className="btn btn-primary" onClick={props.prev}>Previous</button>&emsp;<button  className="btn btn-primary" onClick={props.next}>Next</button>
    </div> );
};

var CardForm = (props) => {
  return (
  <div className="container-fluid">
    <h1>Card Information</h1>
    <br/> <br/>
      <label>Card#:&emsp;</label><input type="text" id="creditcard" defaultValue={props.creditcard}></input><br/><br/>
      <label>Exp:&emsp;</label><input type="text" id="expirymonth" defaultValue={props.expiry.substring(0,2)}></input>/<input type="text" id="expiryyear" defaultValue={props.expiry.substring(2)}></input>
      <br/><br/><label>CCV:&emsp;</label><input type="text" id="cvv" defaultValue={props.cvv}></input><label>&emsp;Billing Zip: </label><input type="text" id="billingzip" defaultValue={props.billingzip}></input><br/><br/>
    <button className="btn btn-primary" onClick={props.prev}>Previous</button> <button className="btn btn-primary" onClick={props.next}>Next</button>
    </div>);
};

var Confirm = (props) => {
console.log(props);
  return (
  <div className="container-fluid">
    <h1>Please Confirm Your Details</h1>
    <br/> <br/>
    <p>Prank Gift Box</p>
    <img src='GiftBox_.jpg'></img>
    <br/> <br/>
    <p>User Information</p>
    <label>Name:&emsp;{props.name}</label><br/><br/>
    <label>Email:&emsp;{props.email}</label><br/><br/>
    <p>Shipping Information</p>
    <label>Address:&emsp;{props.address_1}</label><br/><br/>
    <label>Address 2:&emsp;{props.address_2}</label><br/><br/>
    <label>City:&emsp;{props.city}  </label><label>  State:&emsp;{props.state}  </label><label>  Zip:&emsp;{props.zip}  </label><br/><br/>
    <p>Card Information</p>
    <label>Card#:&emsp;{props.creditcard}</label><br/><br/>
    <label>Exp:&emsp;{props.expiry}  </label><label> CCV:&emsp;{props.ccv}</label><label> Billing Zip:&emsp;{props.billingzip} </label><br/><br/>
    <button className="btn btn-primary" onClick={props.prev}>Previous</button> <button onClick={props.next}>Confirm Purchase</button>
  </div> );
};

var Confirmation = (props) => {
  return (
  <div className="container-fluid">
    <h1>Your Order of Prank Gift Box Has Been Placed</h1>
    <br/> <br/>
    <img src='GiftBox_.jpg'></img>
    <br/> <br/>
    <p>About this product</p>
    <p>PRANK GIFT BOXES at first appear to contain bizarre products from ridiculous companies. Simply pack the real gift inside, and try to keep a straight face as you watch your friends & loved ones attempt to remain gracious while thanking you for the “My First Fire”. Then watch them explode with laughter when they discover their actual gift inside and realize they’ve been pranked.
<br/><br/>TAKE YOUR GIFT GIVING TO THE NEXT LEVEL WITH THE ORIGINAL GAG GIFT BOX.  We pride ourselves on our incredible attention to detail.   We’ve thought of everything from the ridiculous fictional product itself, to the hilarious images and detailed product description. This box will have any recipient truly convinced that you just gave them the most bizarre gift of all time!
<br/><br/>ADD THE GIFT OF LAUGHTER to the party with this quirky and fun twist on the timeless tradition of gift giving. Whether you consider your gift giving skills to be amazing or not, wrapping any gift inside a Prank Pack adds an extra layer of fun and enjoyment that will have everyone in the room laughing.
<br/><br/>HIGH QUALITY GIFT BOXES made in the USA of 100% recyclable cardboard.  Our boxes ship flat and are easy to assemble – no glue or extra steps required.  At 11.25” x 9” x 3.25” they are the perfect size for almost all gifts!
PLEASE NOTE. This is an EMPTY prank GIFT BOX.</p>
    <button className="btn btn-primary" onClick={props.next}>Reorder</button>
    </div> );
};



ReactDOM.render(<App/>, document.getElementById('Main'));