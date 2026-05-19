const prisma = require("../config/prisma");

exports.listRealestate = async (req, res, next) => {
    try {
        const { id } = req.params;
        // console.log(id);
        const realestates = await prisma.eastborder.findMany({
            include: {
                favorites: {
                    where: { profileId: id },
                    select: { id: true }
                },
                images: true
            }
        });

        // console.log(realestates);
        // const realestateWithLike = realestates.map((item)=>{

        //     return { 
        //         ...item, 
        //         isFavorite: item.favorites.length > 0
        //     }

        // });
        const realestateWithLike = realestates.map((item) => ({
            ...item,
            isFavorite: item.favorites.length > 0
        }));
        // console.log(realestateWithLike)
        res.json({ result: realestateWithLike });
    } catch (error) {
        next(error);
    }
};

exports.readRealestate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const realestate = await prisma.eastborder.findFirst({
            where: {
                id: Number(id),
            },
            include: { images: true }
        })

        res.json({ result: realestate })
    } catch (error) {
        next(error)
    }
};

exports.createRealestate = async (req, res, next) => {
    try {
        console.log(req.body)
        const { title, description, price,
            category, type, space, bedroom, bathroom, lat, lng, image, images } = req.body
        const { id } = req.user;

        // Accept the new `images` gallery; fall back to the legacy single
        // `image` so older clients keep working.
        const gallery = (Array.isArray(images) && images.length > 0)
            ? images
            : (image ? [image] : []);
        const cover = gallery[0];

        const realestate = await prisma.eastborder.create({
            data: {
                title: title,
                description: description,
                price: price,
                category: category,
                type: type,
                space: space,
                bedroom: bedroom,
                bathroom: bathroom,
                lat: lat,
                lng: lng,
                public_id: cover.public_id,
                secure_url: cover.secure_url,
                profileId: id,
                images: {
                    create: gallery.map((img) => ({
                        public_id: img.public_id,
                        secure_url: img.secure_url,
                    })),
                },
            },
            include: { images: true },
        })

        res.json({ message: "Create Real Estate Successfully!!!", result: realestate })
    } catch (error) {
        next(error)
    }
};

exports.updateRealestate = (req, res, next) => {
    try {
        res.send('Hello Update ')
    } catch (error) {
        next(error)
    }
};

exports.deleteRealestate = (req, res, next) => {
    try {
        res.send('Hello Delete')
    } catch (error) {
        next(error)
    }
};



// Favorite
exports.actionFavorite = async (req, res, next) => {
    try {
        const { realestateId, isFavorite } = req.body;
        const { id } = req.user;

        //Add or Remove
        let result
        if (isFavorite) {
            result = await prisma.favorite.deleteMany({
                where: {
                    profileId: id,
                    eastborderId: realestateId
                }
            })
        } else {
            result = await prisma.favorite.create({
                data: {
                    eastborderId: realestateId,
                    profileId: id,
                },
            });
        }

        res.json({
            message: isFavorite ? 'Remove favorite' : 'Add Favorite',
            result: result
        })
    } catch (error) {
        next(error)
    }
}



exports.listFavorites = async (req, res, next) => {
    try {
        const { id } = req.user;
        const favorites = await prisma.favorite.findMany({
            where: { profileId: id },
            include: { eastborder: { include: { images: true } } }
        })

        const favoriteWithLike = favorites.map((item) => {
            return {
                ...item,
                eastborder: {
                    ...item.eastborder,
                    isFavorite: true,
                }
            }
        })



        // console.log(favoriteWithLike);

        res.json({ message: "success", result: favoriteWithLike })
    } catch (error) {
        next(error)
    }
};


exports.filterRealestate = async (req, res, next) => {
    try {
        const { category, search, type, price } = req.query;
        console.log(category, search, type, price);

        // สร้าง filter array
        const filters = [];

        if (category && category !== "null") {
            filters.push({ category });
        }

        if (type && type !== "null") {
            filters.push({ type });
        }

        if (price && price !== "null") {
            if (price === "<10000") filters.push({ price: { lt: 10000 } });
            else if (price === "10000-50000") filters.push({ price: { gte: 10000, lte: 50000 } });
            else if (price === "50000-100000") filters.push({ price: { gte: 50000, lte: 100000 } });
            else if (price === ">100000") filters.push({ price: { gt: 100000 } });
        }

        // ค้นหาด้วย title หรือ description
        if (search && search !== "null") {
            filters.push({
                OR: [
                    { title: { contains: search } },
                    { description: { contains: search } }
                ]
            });
        }

        // ถ้าไม่มี filter ให้ return ทั้งหมด

        const whereClause = filters.length > 0 ? { AND: filters } : {};

        const result = await prisma.eastborder.findMany({
            where: whereClause,
            include: {
                favorites: {
                    where: { profileId: req.user?.id },
                    select: { id: true }
                },
                images: true
            }
        });

        const realestateWithLike = result.map((item) => ({
            ...item,
            isFavorite: item.favorites.length > 0
        }));

        // console.log(realestateWithLike)

        res.json({ result: realestateWithLike });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
