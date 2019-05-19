var bigInt = require("big-integer");
var crypto = require("crypto");

function generate_big_number(bits)
{
  return bigInt.randBetween(2**(bits-1), 2**(bits)-1)

}

function isPrime(number)
{
  return bigInt(number).isPrime();

}

function choose_random(a,b)
{
  return bigInt.randBetween(a,b);
}

function return_prime_given_bits(bits)
{
  do{
    var number = generate_big_number(bits)
  }while(!isPrime(number))

  return number;
}

//const hashes = crypto.getHashes();
//console.log(hashes);

function message_to_hash_to_int(message)
{
  const hash = crypto.createHash('sha1');
  hash.update(message);
  var h = hash.digest('hex');
  return bigInt(h,16);
}

// INPUT: Required bit lengths for modulus p and prime divisor q.
//  In practice q should be a prime at least 160 bits long, preferably 256 bits.
//  The modulus p should be at least 1024 bits.

// OUTPUT: Parameters (p,q,g).
// Array
function generate_domain_parameters(p_bits, q_bits)
{
  //var parameters = {bigInt(),bigInt(),bigInt()};

  //Generate a random prime q of the required bit length.
  var q = return_prime_given_bits(q_bits)

  //Choose an even random number j of bit length equal to bitlen(p) − bitlen(q)
  var pb = p_bits - q_bits;

  //Compute p=jq+1. If p is not prime, then go to step 2
  do
  {
    //EVEN
    do
    {
      var j = generate_big_number(pb);
    }while(!bigInt(j).isEven())

    var p = bigInt(j).multiply(q).add(1);

  }while(!isPrime(p))

  //Choose a random number h in the range 1<h<p−1.
  //Compute g=hjmodp. If g=1 then go to step 4.
  do
  {
    var h = choose_random(1,p.subtract(1));
    var g = bigInt(h).modPow(j, p);

  }while ((bigInt(g).equals(1)))

  var parameters = [p,q,g];
  //Return (p,q,g).

  return parameters;

}

console.log("DOMAIN PARAMTERS");
var a = generate_domain_parameters(1024, 160);
console.log(a[0]);
console.log(a[1]);
console.log(a[2]);

console.log(a[0].bitLength());
console.log(a[1].bitLength());

//INPUT: Parameters (p,q,g).
//OUTPUT: "Accept parameters" or "Reject parameters".
function verify_domain_parameters(parameters)
{
  //Check that 1<g<p−1. If not, then return "Reject parameters" and stop
  if ( !bigInt(1).lesser(parameters[0]) && !bigInt(parameters[0]).subtract(1).greater(parameters[2]))
  {
      console.log("Check that 1<g<p−1. If not, then return 'Reject parameters' and stop");
      return false;
  }
  //Test q for primality. If q is not prime then return "Reject parameters" and stop
  if (!isPrime(parameters[1]))
  {
    console.log("Test q for primality. If q is not prime then return 'Reject parameters' and stop");
    return false;
  }
  //Test p for primality. If p is not prime then return "Reject parameters" and stop
  if (!isPrime(parameters[0]))
  {
    console.log("Test p for primality. If q is not prime then return 'Reject parameters' and stop");
    return false;
  }
  //Compute (p−1)modq. If this is not equal to 0 then return "Reject parameters" and stop
  if (!bigInt(parameters[0]).subtract(1).mod(parameters[1]).equals(0))
  {
    console.log("Compute (p−1)modq. If this is not equal to 0 then return 'Reject parameters' and stop")
    return false;
  }
  //Compute g**q modp. If this is not equal to 1 then return "Reject parameters" and stop
  if (!bigInt(parameters[2]).modPow(parameters[1], parameters[0]).equals(1))
  {
    console.log("Compute g**q modp. If this is not equal to 1 then return 'Reject parameters' and stop")
    return false;
  }
  //Return "Accept parameters"
  else
  {
    return true;
  }
}

console.log(verify_domain_parameters(a))


//INPUT: Parameters (p,q,g).
//OUTPUT: Party A's private/public key pair (a,A).
function key_pair_generation(parameters)
{

  //Party A chooses a number a in the range [2,q−2].
  var private = choose_random(2,parameters[1].subtract(2));
  //Compute A=g**a mod p.
  var public = bigInt(parameters[2]).modPow(private,parameters[0]);
  //Return (a,A). Keep a secret.

  var keys = [private,public];
  //Return (p,q,g).

  return keys;
}

console.log("KEY GENERATIONS");
var keys = key_pair_generation(a);
console.log(keys[1]);

//KEEP THIS ONE SECRET
console.log(keys[0]);


//for generation of DSASIG
var privatekey = keys[0];
var publickey = keys[1];
var message = "METRO BOOMING WANTS TO MORE HAHAHAHAHHAHAHHAHAHHAHAHHAH MONTE CARLO 21 SAVAGE EMEINIEM I HATE THIS SHIT";


// INPUT: Domain parameters (p,q,g);
// signer's private key a;
// message-to-be-signed, M; a secure hash function Hash() with output of length |q|.

// OUTPUT: Signature (r,s).

function generate_DSA_signature(parameters,a,message)
{
  //Choose a random k in the range [1,q−1].
  //Compute X=g**kmodp and r=Xmodq. If r=0 (unlikely) then go to step 1.

  do
  {
    var k = choose_random(1,bigInt(parameters[1]).subtract(1));

    var x = bigInt(parameters[2]).modPow(k,parameters[0]);
    var r = bigInt(x).mod(parameters[1]);

  } while(bigInt(r).equals(0))

  //Compute k−1modq. // k mod_inv q modInv(mod)
  var inverse = bigInt(k).modInv(parameters[1]);

  // Compute h=Hash(M) interpreted as an integer in the range 0≤h<q.
  var hash_number = message_to_hash_to_int(message);

  //Compute s=k−1(h+ar)modq. If s=0 (unlikely) then go to step 1.
  do
  {
    var s = bigInt(a).multiply(r).add(hash_number).multiply(inverse).mod(parameters[1]);
  } while(bigInt(s).equals(0))

  //Return (r,s).
  var dsa_signature = [r,s];

  return dsa_signature;
}

console.log("DSA_SIGNATURE");
var dsa_sig = generate_DSA_signature(a,privatekey,message);
console.log(dsa_sig[0]);
console.log(dsa_sig[1]);


// Domain parameters (p,q,g);
// signer's public key A;
// signed-message, M; a secure hash function Hash() with output of length |q|;
// signature (r,s) to be verified.

//OUTPUT: "Accept" or "Reject".
function verify_DSA_signature(parameters,public,message,signature)
{
  //Verify that r and s are in the range [1,q−1]. If not then return "Reject" and stop.
  if ( !bigInt(1).lesser(signature[0]) && !bigInt(parameters[1]).subtract(1).greater(signature[0]))
  {
    return false;
  }
  if ( !bigInt(1).lesser(signature[1]) && !bigInt(parameters[1]).subtract(1).greater(signature[1]))
  {
    return false;
  }

  // Compute w=s−1modq.
  var inverse = bigInt(signature[1]).modInv(parameters[1]);

  //Compute h=Hash(M) interpreted as an integer in the range 0≤h<q.
  var hash_number = message_to_hash_to_int(message);

  //Compute u1=(hw)modq and u2=(rw)modq.
  var u1 = bigInt(hash_number).multiply(inverse).mod(parameters[1]);
  var u2 = bigInt(signature[0]).multiply(inverse).mod(parameters[1]);

  //Compute X=g**u1 A**u2 modp and v=Xmodq.
  //a * b  mod  n
  //(a mod n  *  b mod n)  mod  n
  var x1 = bigInt(parameters[2]).modPow(u1,parameters[0])
  var x2 = bigInt(public).modPow(u2,parameters[0])
  var x = bigInt(x1).multiply(x2).mod(parameters[0]);

  var v = bigInt(x).mod(parameters[1]);
  //If v=r then return "Accept" otherwise return "Reject".

  if ( bigInt(v).equals(signature[0]))
  {

    return true;
  }
  else
  {
    console.log(v);
    console.log(signature[0])
    return false;
  }


}

console.log("VERIFYING DSA SIGNATURES");
var k = verify_DSA_signature(a,publickey,message,dsa_sig);
console.log(k);
