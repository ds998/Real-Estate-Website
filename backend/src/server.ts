import express, { json } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose, { mongo, Mongoose } from 'mongoose';
import user from './model/user';
import agency from './model/agency';
import microlocation from './model/microlocation';
import city from './model/city';
import municipality from './model/municipality';
import real_estate from './model/real_estate';



const app = express();
const multer = require('multer');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/nekretnine2022');


const conn = mongoose.connection;

conn.once('open', ()=>{
    console.log('mongo open');
})

const router = express.Router();

var photoStorage = multer.diskStorage({
    destination: function (request:any, response:any, cb:any) {
        let dir = __dirname + '/photos';
        console.log(dir);
        cb(null, dir);
    },

    filename: function (request:any, file:any, cb:any) {
        console.log(file);
        cb(null, file.originalname);
    }
});

var uploadPhoto = multer({
    storage: photoStorage,
    fileFilter: (req: any, file:any,cb:any) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      }
}).single('file');

var uploadMulPhotos=multer({
    storage: photoStorage,
    fileFilter: (req: any, file:any,cb:any) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      }
}).array('files',6);

router.route('/uploadphotos').post((request, response) => {
    try {
        uploadPhoto(request, response, (err: any) => {
            if (err) {
                console.log(err);
                response.status(410).json({'status':'no'});
            } else {
                console.log('upload success');
                response.status(200).json({'status':'ok'});
            }
        });

    } catch (error) {
        console.log(error);
        response.status(500).json({'status':'ok'});
    }
});

router.route('/uploadmulphotos').post((request, response) => {
    try {
        uploadMulPhotos(request, response, (err: any) => {
            if (err) {
                console.log(err);
                response.status(410).json({'status':'no'});
            } else {
                console.log('upload success');
                response.status(200).json({'status':'ok'});
            }
        });

    } catch (error) {
        console.log(error);
        response.status(500).json({'status':'ok'});
    }
});

router.route('/downloadphotos/:filename').get((request, response) => {
    var filename = request.params.filename;
    var fullpath = __dirname + '/photos/' + filename;
    response.download(fullpath);
})

router.route('/login').post((req,res)=>{
    let username=req.body.username;
    let password=req.body.password;

    user.findOne({'username':username,'password':password},(err,user)=>{
        if(err) console.log(err);
        else res.json(user);
    })
});

router.route('/register').post((req,res)=>{
    let username=req.body.username;
    let email=req.body.email;
    user.findOne({'username':username},(err,user2)=>{
        if(err)console.log(err);
        else if(user2) res.json({'user':'exists'});
        else{
            user.findOne({'email':email},(err2,user3)=>{
                if(err2) console.log(err2);
                else if(user3) res.json({'user':'email'});
                else{
                    if(req.body.agency!=""){
                        user.findOne({'agency':req.body.agency,'licence':req.body.licence},(err3,user4)=>{
                            if(err3) console.log(err3);
                            else if(user4) res.json({'user':'agency'});
                            else{
                                let u=new user(req.body);
                                u.save().then(u=>{
                                    res.json({'user':'ok'});
                                }).catch(err=>{
                                    res.json({'user':'no'});
                                })
                            }
                        })
                    }else{
                        let u=new user(req.body);
                            u.save().then(u=>{
                        res.json({'user':'ok'});
                        }).catch(err=>{
                            res.json({'user':'no'});
                        })
                    }
                    
                }
            })
            
        }
    })
    
    
});

router.route('/change_password').post((req,resp)=>{
    let username=req.body.username;
    let new_password=req.body.password;
    user.updateOne({'username':username},{
        password:new_password
    }).then(res=>{
        resp.json(res);
    })
});

router.route('/all_agencies').get((req,resp)=>{
    agency.find({},(err,agencies)=>{
        if(err) console.log(err);
        else resp.json(agencies);
    })
})

router.route('/change_approval').post((req,resp)=>{
    let username=req.body.username;
    let n=req.body.n;
    user.updateOne({'username':username},{
        approved:n
    }).then(res=>{
        resp.json(res);
    })
});


router.route('/remove_user').post((req,resp)=>{
    let username=req.body.username;
    user.deleteOne({'username':username}).then(res=>{
        resp.json(res);
    })
});

router.route('/undenied_users').get((req,resp)=>{
    user.find({'approved':{$gt:-1}},(err,users)=>{
        if(err) console.log(err);
        else resp.json(users);
    })
})

router.route('/new_agency').post((req,resp)=>{
    let PIB=req.body.PIB;
    agency.findOne({'PIB':PIB},(err,agent)=>{
        if(err) console.log(err);
        else if(agent) resp.json({'agency':'exists'});
        else{
            let a=new agency(req.body);
            a.save().then(a=>{
                resp.json({'agency':'ok'});
            }).catch(err2=>{
                resp.json({'agency':'no'});
            })
        }
    })
});

router.route('/all_cities').get((req,resp)=>{
    city.find((err,cities)=>{
        if(err) console.log(err);
        else resp.json(cities);
    })
});

router.route('/city_municipalities').post((req,resp)=>{
    municipality.find({'city':req.body.city},(err,mps)=>{
        if(err) console.log(err);
        else resp.json(mps);
    });
});

router.route('/mp_microloc').post((req,resp)=>{
    let city=req.body.city;
    let municipality=req.body.municipality;
    microlocation.find({'city':city,'municipality':municipality},(err,microlocations)=>{
        if(err) console.log(err);
        else resp.json(microlocations);
    })
});

router.route('/new_microlocation').post((req,resp)=>{
    let name=req.body.name;
    let city=req.body.city;
    let municipality=req.body.municipality;
    microlocation.findOne({'name':name,'city':city,'municipality':municipality},(err,ml)=>{
        if(err) console.log(err);
        else if(ml) resp.json({'microlocation':'exists'});
        else{
            let m=new microlocation(req.body);
            m.save().then(a=>{
                resp.json({'microlocation':'ok'});
            }).catch(err2=>{
                resp.json({'microlocation':'no'});
            });
        }
    });
    
});

router.route('/all_microlocations').get((req,resp)=>{
    microlocation.find((err,microlocations)=>{
        if(err) console.log(err);
        else resp.json(microlocations);
    })
});

router.route('/empty_microlocation').post((req,resp)=>{
    real_estate.find({'microlocation':new mongoose.Types.ObjectId(req.body.microlocation)},(err,r_est)=>{
        if(err)console.log(err);
        else{
            resp.json(r_est);
        }
    })
});

router.route('/delete_microlocation').post((req,resp)=>{
    microlocation.findByIdAndDelete(new mongoose.Types.ObjectId(req.body._id),(err,succ)=>{
        if(err) console.log(err);
        else resp.json(succ);
    })
});

router.route('/get_microlocation').post((req,resp)=>{
    microlocation.findById(new mongoose.Types.ObjectId(req.body._id),(err,ml)=>{
        if(err) console.log(err);
        else resp.json(ml);
    })
});

router.route('/find_user').post((req,resp)=>{
    user.findOne({'username':req.body.username},(err,user)=>{
        if(err) console.log(err);
        else resp.json(user);
    })
});

router.route('/update_user').post((req,resp)=>{
    let username=req.body.username;
    let diff_email=req.body.diff_email;
    let diff_agency = req.body.diff_agency;
    user.findOne({'username':username},(err,our_user)=>{
        if(err)console.log(err);
        else if(our_user){
            if(diff_email){
                user.findOne({'email':req.body.email},(err10,user6)=>{
                    if(err10) {
                        console.log(err10);
                        return;
                    }
                    else if(user6){
                        return resp.json({'user':'email'});
                    }else{
                        if(diff_agency){
                            user.findOne({'agency':req.body.agency,'licence':req.body.licence},(err11,user7)=>{
                                if(err11) {
                                    console.log(err11);
                                    return;
                                }
                                else if(user7) {
                                    return resp.json({'user':'agency'});
                                }
                                else{
                                    user.updateOne({'username': username},{
                                        name:req.body.name,
                                        surname:req.body.surname,
                                        password:req.body.password,
                                        type:req.body.type,
                                        city:req.body.city,
                                        birthday:req.body.birthday,
                                        email:req.body.email,
                                        phone:req.body.phone,
                                        picture:req.body.picture,
                                        agency:req.body.agency,
                                        licence:req.body.licence,
                                        approved:req.body.approved
                                    },(err12,result5)=>{
                                        if(err12) {
                                            console.log(err12); return;
                                        }
                                        else return resp.json({'user':'ok'});
                                    })
                                }
                            });
                        }else{
                            user.updateOne({'username': username},{
                                name:req.body.name,
                                surname:req.body.surname,
                                password:req.body.password,
                                type:req.body.type,
                                city:req.body.city,
                                birthday:req.body.birthday,
                                email:req.body.email,
                                phone:req.body.phone,
                                picture:req.body.picture,
                                agency:req.body.agency,
                                licence:req.body.licence,
                                approved:req.body.approved
                            },(err13,result6)=>{
                                if(err13) {
                                    console.log(err13); return;
                                }
                                else return resp.json({'user':'ok'});
                            })
                        }
                    } 
                });
            }else{
                if(diff_agency){
                    user.findOne({'agency':req.body.agency,'licence':req.body.licence},(err13,user13)=>{
                        if(err13) {
                            console.log(err13);
                            return;
                        }
                        else if(user13) {
                            return resp.json({'user':'agency'});
                        }
                        else{
                            user.updateOne({'username': username},{
                                name:req.body.name,
                                surname:req.body.surname,
                                password:req.body.password,
                                type:req.body.type,
                                city:req.body.city,
                                birthday:req.body.birthday,
                                email:req.body.email,
                                phone:req.body.phone,
                                picture:req.body.picture,
                                agency:req.body.agency,
                                licence:req.body.licence,
                                approved:req.body.approved
                            },(err14,result7)=>{
                                if(err14) {
                                    console.log(err14); return;
                                }
                                else return resp.json({'user':'ok'});
                            })
                        }
                    });
                }else{
                    user.updateOne({'username': username},{
                        name:req.body.name,
                        surname:req.body.surname,
                        username:req.body.username,
                        password:req.body.password,
                        type:req.body.type,
                        city:req.body.city,
                        birthday:req.body.birthday,
                        email:req.body.email,
                        phone:req.body.phone,
                        picture:req.body.picture,
                        agency:req.body.agency,
                        licence:req.body.licence,
                        approved:req.body.approved
                    },(err15,result8)=>{
                        if(err15) {
                            console.log(err15); return;
                        }
                        else return resp.json({'user':'ok'});
                    })
                }
            }

            
        }else return resp.json({'user':'no'});
    })
    
    
});

router.route('/new_real_estate').post((req,resp)=>{
    let re=new real_estate(req.body);
            re.save().then(re=>{
                resp.json({'real_estate':'ok'});
            }).catch(err=>{
                resp.json({'real_estate':'no'});
            })
});

router.route('/real_estates_by_user').post((req,resp)=>{
    let username=req.body.username;
    real_estate.find({'advertiser.username':username},(err,real_estates)=>{
        if(err) console.log(err);
        else resp.json(real_estates);
    })
});

router.route('/sell_real_estate').post((req,resp)=>{
    let _id=req.body._id;
    let n=req.body.n;
    real_estate.updateOne({'_id':_id},{'selling_month':n},(err,succ)=>{
        if(err) console.log(err);
        else resp.json(succ);
    })
});

router.route('/find_real_estate').post((req,resp)=>{
    let _id=req.body._id;
    real_estate.findOne({'_id':new mongoose.Types.ObjectId(_id)},(err,real_estate)=>{
        if(err) console.log(err);
        else resp.json(real_estate);
    })
});

router.route('/update_real_estate').post((req,resp)=>{
    let _id=req.body._id;
    real_estate.updateOne({'_id':_id},{
        name:req.body.name,
        microlocation:req.body.microlocation,
        street:req.body.street,
        lines:req.body.lines,
        area:req.body.area,
        type:req.body.type,
        rooms:req.body.rooms,
        construction_year:req.body.construction_year,
        state:req.body.state,
        heating:req.body.heating,
        floor:req.body.floor,
        total_floors:req.body.total_floors,
        parking:req.body.parking,
        monthly_utilities:req.body.monthly_utilities,
        price:req.body.price,
        about:req.body.about,
        characteristics:req.body.characteristics,
        advertiser:req.body.advertiser,
        pictures:req.body.pictures,
        selling_month:req.body.selling_month,
        change_time:req.body.change_time
    },(err,real_estate)=>{
        if(err) console.log(err);
        else resp.json(real_estate);
    })
});

router.route('/update_advertiser').post((req,resp)=>{
    let username= req.body.username;
    let agency=req.body.agency;
    let licence=req.body.licence;
    let phone=req.body.phone;
    let email = req.body.email;
    let diff_email=req.body.diff_email;
    let diff_agency=req.body.diff_agency;
    let diff_phone=req.body.diff_phone;

    let x:any={};
    if(diff_phone) x.phone=phone;
    if(diff_email) x.email=email;
    if(diff_agency && agency!=""){
        x.agency=agency;
        x.licence=licence;
    }else if(diff_agency && agency==""){
        x.agency="";
        x.licence=0;
    }

    user.findOne({'username':username},(err,our_user)=>{
        if(err)console.log(err);
        else if(our_user){
            if(diff_email){
                user.findOne({'email':req.body.email},(err10,user6)=>{
                    if(err10) {
                        console.log(err10);
                        return;
                    }
                    else if(user6){
                        return resp.json({'user':'email'});
                    }else{
                        if(diff_agency){
                            user.findOne({'agency':req.body.agency,'licence':req.body.licence},(err11,user7)=>{
                                if(err11) {
                                    console.log(err11);
                                    return;
                                }
                                else if(user7) {
                                    return resp.json({'user':'agency'});
                                }
                                else{
                                    user.updateOne({'username': username},x,(err12,result5)=>{
                                        if(err12) {
                                            console.log(err12); return;
                                        }
                                        else return resp.json({'user':'ok'});
                                    })
                                }
                            });
                        }else{
                            user.updateOne({'username': username},x,(err13,result6)=>{
                                if(err13) {
                                    console.log(err13); return;
                                }
                                else return resp.json({'user':'ok'});
                            })
                        }
                    } 
                });
            }else{
                if(diff_agency){
                    user.findOne({'agency':req.body.agency,'licence':req.body.licence},(err13,user13)=>{
                        if(err13) {
                            console.log(err13);
                            return;
                        }
                        else if(user13) {
                            return resp.json({'user':'agency'});
                        }
                        else{
                            user.updateOne({'username': username},x,(err14,result7)=>{
                                if(err14) {
                                    console.log(err14); return;
                                }
                                else return resp.json({'user':'ok'});
                            })
                        }
                    });
                }else{
                    user.updateOne({'username': username},x,(err15,result8)=>{
                        if(err15) {
                            console.log(err15); return;
                        }
                        else return resp.json({'user':'ok'});
                    })
                }
            }

            
        }else return resp.json({'user':'no'});
    })


});

router.route('/agency_real_estates').post((req,resp)=>{
    let PIB=req.body.PIB;
    real_estate.find({'advertiser.PIB':PIB},(err,real_estates)=>{
        if(err) console.log(err);
        else resp.json(real_estates);
    })
});

router.route('/all_municipalities').get((req,resp)=>{
    municipality.find((err,municipalities)=>{
        if(err) console.log(err);
        else resp.json(municipalities);
    })
});

router.route('/search').post((req,resp)=>{
    let type=req.body.type;
    let locations=req.body.locations;
    let price=req.body.price;
    let area=req.body.area;
    let rooms=req.body.rooms;
    let location_filter=req.body.location_filter;
    let price_filter=req.body.price_filter;
    let area_filter=req.body.area_filter;
    let rooms_filter=req.body.rooms_filter;

    let search_array:any={};
    search_array.type=type;
    if(location_filter){
        if(locations.length==1){
            search_array.microlocation=locations[0];
        }else{
            search_array.microlocation={$in:locations};
        }
    }
    if(price_filter){
        search_array.price={$lte:price};
    }
    if(area_filter){
        search_array.area={$gte:area};
    }
    if(rooms_filter){
        search_array.rooms={$gte:rooms};
    }
    search_array.selling_month=0;
    real_estate.find(search_array,(err,real_estates)=>{
        if(err) console.log(err);
        else resp.json(real_estates);
    })
});

router.route('/type_average').post((req,resp)=>{
    let type=req.body.type;
    let microlocation=req.body.microlocation;
    real_estate.find({'type':type,'microlocation':new mongoose.Types.ObjectId(req.body.microlocation)},(err,real_estates)=>{
        if(err) console.log(err);
        else resp.json(real_estates);
    })
});

router.route('/find_agency').post((req,resp)=>{
    let PIB=req.body.PIB;
    agency.findOne({'PIB':PIB},(err,agency_)=>{
        if(err) console.log(err);
        else resp.json(agency_);
    })
});

router.route('/average').post((req,resp)=>{
    let microlocation=req.body.microlocation;
    real_estate.find({'microlocation':new mongoose.Types.ObjectId(req.body.microlocation)},(err,real_estates)=>{
        if(err) console.log(err);
        else resp.json(real_estates);
    })
});

router.route('/get_last_five').get((req,resp)=>{
    real_estate.find({}).sort({_id:-1}).limit(5).exec((err,real_estates)=>{
        if(err)console.log(err);
        else resp.json(real_estates);
    })
});

router.route('/insert_favorite').post((req,resp)=>{
    let username = req.body.username;
    let _id=req.body._id;
    user.updateOne({'username':username},{$push:{'favorites':_id}},(err,res)=>{
        if(err) console.log(err);
        else resp.json(res);
    })
});

router.route('/remove_favorite').post((req,resp)=>{
    let username = req.body.username;
    let _id=req.body._id;
    user.updateOne({'username':username},{$pull:{'favorites':_id}},(err,res)=>{
        if(err) console.log(err);
        else resp.json(res);
    })
});

router.route('/advanced_search').post((req,resp)=>{
    let min_price=req.body.min_price;
    let max_price=req.body.max_price;
    let min_area=req.body.min_area;
    let max_area=req.body.max_area;
    let min_rooms=req.body.min_rooms;
    let max_rooms=req.body.max_rooms;
    let min_construction_year=req.body.min_construction_year;
    let max_construction_year=req.body.max_construction_year;
    let advertiser=req.body.advertiser;
    let state=req.body.state;
    let heating=req.body.heating;
    let min_floor=req.body.min_floor;
    let max_floor=req.body.max_floor;
    let min_monthly_utilities=req.body.min_monthly_utilities;
    let max_monthly_utilities=req.body.max_monthly_utilities;
    let characteristics=req.body.characteristics;

    let search_array:any={};

    let price:any={};
    price.$gte=min_price;
    if(max_price>0) price.$lte=max_price;
    search_array.price=price;

    let area:any={};
    area.$gte=min_area;
    if(max_area>0) area.$lte=max_area;
    search_array.area=area;

    let rooms:any={};
    rooms.$gte=min_rooms;
    if(max_rooms>0) rooms.$lte=max_rooms;
    search_array.rooms=rooms;

    let construction_year:any={};
    construction_year.$gte=min_construction_year;
    if(max_construction_year>0) construction_year.$lte=max_construction_year;
    search_array.construction_year=construction_year;

    if(advertiser.length>0){
        if(advertiser.length==1){
            search_array['advertiser.type']=advertiser[0];
        }else{
            search_array['advertiser.type']={$in:advertiser};
        }
    }

    if(state.length>0){
        if(state.length==1){
            search_array.state=state[0];
        }else{
            search_array.state={$in:state};
        }
    }

    if(heating.length>0){
        if(heating.length==1){
            search_array.heating=heating[0];
        }else{
            search_array.heating={$in:heating};
        }
    }

    let floor:any={};
    floor.$gte=min_floor;
    if(max_floor>0) floor.$lte=max_floor;
    search_array.floor=floor;

    let monthly_utilities:any={};
    monthly_utilities.$gte=min_monthly_utilities;
    if(max_monthly_utilities>0) monthly_utilities.$lte=max_monthly_utilities;
    search_array.monthly_utilities=monthly_utilities;

    if(characteristics.length>0){
        if(characteristics.length==1){
            search_array.characteristics=characteristics[0];
        }else{
            search_array.characteristics={$in:characteristics};
        }
    }

    search_array.selling_month=0;
    real_estate.find(search_array,(err,real_estates)=>{
        if(err) console.log(err);
        else resp.json(real_estates);
    })
});

app.use('/',router);
app.listen(4000, () => console.log(`Express server running on port 4000`));